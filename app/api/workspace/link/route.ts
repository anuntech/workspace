/* eslint-disable no-mixed-spaces-and-tabs */
import config from "@/config";
import conf from "@/config";
import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { routeWrapper } from "@/libs/routeWrapper";
import { s3Client } from "@/libs/s3-client";
import Applications from "@/models/Applications";
import MyApplications from "@/models/MyApplications";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = routeWrapper(POSTHandler, "/api/workspace/link");

async function POSTHandler(request: Request) {
	const session = await getServerSession(authOptions);

	await connectMongo();

	const body = await request.formData();

	const workspace = await Workspace.findById(body.get("workspaceId"));
	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	const memberRole = workspace.members.find(
		(member) => member.memberId.toString() === session.user.id.toString(),
	)?.role;

	if (
		workspace.owner.toString() !== session.user.id &&
		memberRole !== "admin"
	) {
		return NextResponse.json(
			{
				error: "You do not have permission to create a link for this workspace",
			},
			{ status: 403 },
		);
	}

	const profilePhoto = body.get("icon") as File;
	const profilePhotoId = randomUUID().toString();

	let icon: {
		type: "image" | "emoji" | "lucide" | "favicon";
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
				type: body.get("iconType") as "image" | "emoji" | "lucide" | "favicon",
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
		membersAllowed: [],
	});

	await workspace.save();

	return NextResponse.json(workspace);
}

export const GET = routeWrapper(GETHandler, "/api/workspace/link");

async function GETHandler(request: Request) {
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
			{ status: 400 },
		);
	}

	const workspace = await Workspace.findById(workspaceId);
	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	const isMember = workspace.members.some(
		(member) => member.memberId.toString() === session.user.id.toString(),
	);
	const isOwner = workspace.owner.toString() === session.user.id;

	if (!isOwner && !isMember) {
		return NextResponse.json(
			{ error: "You do not have permission to view this workspace's links" },
			{ status: 403 },
		);
	}

	const memberRole = workspace.members.find(
		(member) => member.memberId.toString() === session.user.id.toString(),
	)?.role;
	const isAdminOrOwner =
		workspace.owner.toString() === session.user.id || memberRole === "admin";

	const permittedLinks = isAdminOrOwner
		? workspace.links
		: workspace.links.filter((link) =>
				link.membersAllowed.some(
					(memberId) => memberId.toString() === session.user.id.toString(),
				),
			);

	return NextResponse.json({ links: permittedLinks });
}

export const DELETE = routeWrapper(DELETEHandler, "/api/workspace/link");

async function DELETEHandler(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	await connectMongo();

	const { searchParams } = new URL(request.url);
	const workspaceId = searchParams.get("workspaceId");

	if (!workspaceId) {
		return NextResponse.json(
			{ error: "workspaceId is required" },
			{ status: 400 },
		);
	}

	const linkId = searchParams.get("linkId");
	if (!linkId) {
		return NextResponse.json({ error: "linkId is required" }, { status: 400 });
	}

	const workspace = await Workspace.findById(workspaceId);
	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	const memberRole = workspace.members.find(
		(member) => member.memberId.toString() === session.user.id.toString(),
	)?.role;

	if (
		workspace.owner.toString() !== session.user.id &&
		memberRole !== "admin"
	) {
		return NextResponse.json(
			{
				error: "You do not have permission to create a link for this workspace",
			},
			{ status: 403 },
		);
	}

	const linkIndex = workspace.links.findIndex(
		(link) => link._id.toString() === linkId,
	);
	if (linkIndex === -1) {
		return NextResponse.json({ error: "Link not found" }, { status: 404 });
	}

	workspace.links.splice(linkIndex, 1);
	await workspace.save();

	await MyApplications.findOneAndUpdate(
		{
			workspaceId: workspace.id,
		},
		{
			$pull: {
				favoriteApplications: {
					applicationId: linkId,
				},
			},
		},
	);

	return NextResponse.json({ links: workspace.links || [] });
}

export const PUT = routeWrapper(PUTHandler, "/api/workspace/link");

async function PUTHandler(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	await connectMongo();

	const { searchParams } = new URL(request.url);
	const workspaceId = searchParams.get("workspaceId");
	const linkId = searchParams.get("linkId");

	if (!workspaceId || !linkId) {
		return NextResponse.json(
			{ error: "workspaceId and linkId are required" },
			{ status: 400 },
		);
	}

	const workspace = await Workspace.findById(workspaceId);
	if (!workspace) {
		return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
	}

	const memberRole = workspace.members.find(
		(member) => member.memberId.toString() === session.user.id.toString(),
	)?.role;

	if (
		workspace.owner.toString() !== session.user.id &&
		memberRole !== "admin"
	) {
		return NextResponse.json(
			{
				error: "You do not have permission to update a link for this workspace",
			},
			{ status: 403 },
		);
	}

	const linkIndex = workspace.links.findIndex(
		(link) => link._id.toString() === linkId,
	);
	if (linkIndex === -1) {
		return NextResponse.json({ error: "Link not found" }, { status: 404 });
	}

	const body = await request.formData();
	const profilePhoto = body.get("icon") as File;
	let icon = workspace.links[linkIndex].icon;

	if (body.get("iconType") === "image" && profilePhoto instanceof File) {
		const profilePhotoId = randomUUID().toString();
		const form = {
			Bucket: process.env.NEXT_PUBLIC_HETZNER_BUCKET_NAME!,
			Key: profilePhotoId,
			Body: Buffer.from(await profilePhoto.arrayBuffer()),
			ContentType: profilePhoto.type,
			ACL: "public-read",
		} as PutObjectCommandInput;

		const command = new PutObjectCommand(form);
		await s3Client.send(command);

		icon = {
			type: "image",
			value: profilePhotoId,
		};
	} else if (body.get("iconType") && body.get("iconType") !== "image") {
		icon = {
			type: body.get("iconType") as "image" | "emoji" | "lucide",
			value: body.get("icon") as string,
		};
	}

	workspace.links[linkIndex] = {
		...workspace.links[linkIndex],
		title: (body.get("title") as string) || workspace.links[linkIndex].title,
		url: (body.get("url") as string) || workspace.links[linkIndex].url,
		icon: icon,
		urlType:
			(body.get("urlType") as "none" | "iframe" | "newWindow" | "sameWindow") ||
			workspace.links[linkIndex].urlType,
		fields: body.get("fields")
			? JSON.parse(body.get("fields") as string)
			: workspace.links[linkIndex].fields,
		membersAllowed: body.get("membersAllowed")
			? JSON.parse(body.get("membersAllowed") as string)
			: workspace.links[linkIndex].membersAllowed,
	};

	await workspace.save();

	return NextResponse.json({ link: workspace.links[linkIndex] });
}
