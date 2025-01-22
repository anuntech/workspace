import config from "@/config";
import conf from "@/config";
import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { s3Client } from "@/libs/s3-client";
import Applications from "@/models/Applications";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		await connectMongo();

		const body = await request.formData();

		const workspace = await Workspace.findById(body.get("workspaceId"));
		if (!workspace) {
			return NextResponse.json(
				{ error: "Workspace not found" },
				{ status: 404 }
			);
		}

		const memberRole = workspace.members.find(
			(member) => member.memberId.toString() === session.user.id.toString()
		)?.role;

		if (
			workspace.owner.toString() !== session.user.id &&
			memberRole !== "admin"
		) {
			return NextResponse.json(
				{
					error:
						"You do not have permission to create a link for this workspace",
				},
				{ status: 403 }
			);
		}

		const profilePhoto = body.get("icon") as File;
		const profilePhotoId = randomUUID().toString();

		let icon: {
			type: "image" | "emoji" | "lucide";
			value: string;
		};

		switch (body.get("iconType")) {
			case "image":
				if (profilePhoto) {
					const form = {
						Bucket: process.env.NEXT_PUBLIC_HETZNER_BUCKET_NAME!,
						Key: profilePhotoId,
						Body: Buffer.from(await profilePhoto.arrayBuffer()),
						ContentType: profilePhoto.type,
						ACL: "public-read",
					} as PutObjectCommandInput;

					const command = new PutObjectCommand(form);
					await s3Client.send(command);
				}

				icon = {
					type: body.get("iconType") as "image" | "emoji" | "lucide",
					value: profilePhotoId,
				};
				break;
			default:
				icon = {
					type: body.get("iconType") as "image" | "emoji" | "lucide",
					value: body.get("icon") as string,
				};
		}

		if (!workspace.links) {
			workspace.links = [];
		}

		workspace.links.push({
			title: body.get("title") as string,
			url: body.get("url") as string,
			icon: icon,
			urlType: body.get("urlType") as
				| "none"
				| "iframe"
				| "newWindow"
				| "sameWindow",
			fields: JSON.parse(body.get("fields") as string),
		});

		await workspace.save();

		return NextResponse.json(workspace);
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e?.message }, { status: 500 });
	}
}

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await connectMongo();

		const { searchParams } = new URL(request.url);
		const workspaceId = searchParams.get("workspaceId");

		if (!workspaceId) {
			return NextResponse.json(
				{ error: "Workspace ID is required" },
				{ status: 400 }
			);
		}

		const workspace = await Workspace.findById(workspaceId);
		if (!workspace) {
			return NextResponse.json(
				{ error: "Workspace not found" },
				{ status: 404 }
			);
		}

		const isMember = workspace.members.some(
			(member) => member.memberId.toString() === session.user.id.toString()
		);
		const isOwner = workspace.owner.toString() === session.user.id;

		if (!isOwner && !isMember) {
			return NextResponse.json(
				{ error: "You do not have permission to view this workspace's links" },
				{ status: 403 }
			);
		}

		return NextResponse.json({ links: workspace.links || [] });
	} catch (e) {
		console.error(e);
		return NextResponse.json(
			{ error: e?.message || "Internal server error" },
			{ status: 500 }
		);
	}
}
