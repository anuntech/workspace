import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { isValidEmoji } from "@/libs/icons";
import { randomUUID } from "crypto";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "@/libs/s3-client";
import imageType from "image-type";
import User from "@/models/User";
import { routeWrapper } from "@/libs/routeWrapper";

export const PATCH = routeWrapper(PATCHHandler, "/api/user/icon");

async function PATCHHandler(request: Request) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json(
			{ error: "User not authenticated" },
			{ status: 401 },
		);
	}

	await connectMongo();

	const body = await request.formData();
	const userId = session.user.id.toString();

	const iconType = body.get("iconType") as string;
	const allowedIconTypes = ["image", "emoji", "lucide"];
	if (!allowedIconTypes.includes(iconType)) {
		return NextResponse.json({ error: "Invalid icon type" }, { status: 400 });
	}

	const user = await User.findById(userId);
	switch (iconType) {
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
			const type = await imageType(buffer);

			if (!type || !allowedMimeTypes.includes(type.mime)) {
				return NextResponse.json(
					{ error: "Invalid image file" },
					{ status: 400 },
				);
			}

			const uniqueId = `${userId}-${randomUUID()}`;

			const form = {
				Bucket: process.env.NEXT_PUBLIC_HETZNER_BUCKET_NAME!,
				Key: uniqueId,
				Body: buffer,
				ContentType: file.type,
				ACL: "public-read",
			} as PutObjectCommandInput;

			const command = new PutObjectCommand(form);
			await s3Client.send(command);

			user.icon.type = "image";
			user.icon.value = uniqueId;
			break;
		}
		case "emoji": {
			const icon = body.get("icon") as string;
			if (!icon || !isValidEmoji(icon)) {
				return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
			}

			user.icon.type = "emoji";
			user.icon.value = icon;
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

			user.icon.type = "lucide";
			user.icon.value = icon;
			break;
		}
		default:
			return NextResponse.json({ error: "Invalid icon type" }, { status: 400 });
	}

	await user.save();

	return NextResponse.json(user);
}
