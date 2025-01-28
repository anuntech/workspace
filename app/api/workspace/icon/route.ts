import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Workspace from "@/models/Workspace";
import { isValidEmoji } from "@/libs/icons";
import { randomUUID } from "crypto";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "@/libs/s3-client";
import mongoose from "mongoose";
import imageType from "image-type";
import sharp from "sharp";

export async function PATCH(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ error: "User not authenticated" },
				{ status: 401 },
			);
		}

		await connectMongo();

		const body = await request.formData();

		const workspaceId = body.get("workspaceId") as string;
		if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
			return NextResponse.json(
				{ error: "Invalid workspace ID" },
				{ status: 400 },
			);
		}

		const workspace = await Workspace.findById(workspaceId);

		if (!workspace) {
			return NextResponse.json(
				{ error: "Workspace not found" },
				{ status: 404 },
			);
		}

		const userId = session.user.id.toString();
		const member = workspace.members.find(
			(val) => val.memberId.toString() === userId,
		);

		const isAdmin = member?.role === "admin";
		const isOwner = workspace.owner.toString() === userId;

		if (!isAdmin && !isOwner) {
			return NextResponse.json(
				{ error: "You are not authorized to perform this action" },
				{ status: 403 },
			);
		}

		const iconType = body.get("iconType") as string;
		const allowedIconTypes = ["image", "emoji", "lucide"];
		if (!allowedIconTypes.includes(iconType)) {
			return NextResponse.json({ error: "Invalid icon type" }, { status: 400 });
		}

		switch (iconType) {
			// No servidor (API Handler)
			case "image": {
				const file = body.get("icon") as File;

				if (!file) {
					return NextResponse.json(
						{ error: "No file uploaded" },
						{ status: 400 },
					);
				}

				const allowedMimeTypes = [
					"image/jpeg",
					"image/png",
					"image/gif",
					"image/webp",
				];
				if (!allowedMimeTypes.includes(file.type)) {
					return NextResponse.json(
						{ error: "Unsupported file type" },
						{ status: 400 },
					);
				}

				if (file.size > 10 * 1024 * 1024) {
					return NextResponse.json(
						{ error: "File size exceeds 10MB" },
						{ status: 400 },
					);
				}

				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);

				// Remova o uso desnecessário de imageType se não for necessário
				// const type = await imageType(buffer);

				// Gere um nome de arquivo único com a extensão correta
				const extension = file.type.split("/")[1]; // "png", "jpeg", etc.
				const uniqueId = `${workspaceId}-${randomUUID()}.${extension}`;

				const form = {
					Bucket: process.env.NEXT_PUBLIC_HETZNER_BUCKET_NAME!,
					Key: uniqueId,
					Body: buffer,
					ContentType: file.type,
					ACL: "public-read",
				} as PutObjectCommandInput;

				const command = new PutObjectCommand(form);
				await s3Client.send(command);

				workspace.icon.type = "image";
				workspace.icon.value = uniqueId;
				break;
			}
			case "emoji": {
				const icon = body.get("icon") as string;
				if (!icon || !isValidEmoji(icon)) {
					return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
				}

				workspace.icon.type = "emoji";
				workspace.icon.value = icon;
				break;
			}

			case "lucide": {
				const icon = body.get("icon") as string;
				if (!icon) {
					return NextResponse.json(
						{ error: "Invalid lucide icon" },
						{ status: 400 },
					);
				}

				workspace.icon.type = "lucide";
				workspace.icon.value = icon;
				break;
			}

			default:
				return NextResponse.json(
					{ error: "Invalid icon type" },
					{ status: 400 },
				);
		}

		await workspace.save();

		return NextResponse.json(workspace);
	} catch (e) {
		console.error(e);
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 },
		);
	}
}
