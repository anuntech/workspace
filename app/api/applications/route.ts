import config from "@/config";
import conf from "@/config";
import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { s3Client } from "@/libs/s3-client";
import Applications from "@/models/Applications";
import User from "@/models/User";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		const user = await User.findById(session.user.id);
		if (user.email.split("@")[1] !== config.domainName) {
			return NextResponse.json(
				{ error: "You have no permission" },
				{ status: 403 },
			);
		}

		await connectMongo();

		const body = await request.formData();

		const galleryPhotos = body.getAll("galeryPhotos");
		const galleryPhotosIds = [];

		if (galleryPhotos && galleryPhotos.length > 0) {
			for (const file of Array.from(galleryPhotos) as File[]) {
				const id = randomUUID().toString();
				galleryPhotosIds.push(id);
				const form = {
					Bucket: process.env.NEXT_PUBLIC_HETZNER_BUCKET_NAME!,
					Key: id,
					Body: Buffer.from(await file.arrayBuffer()),
					ContentType: file.type,
					ACL: "public-read",
				} as PutObjectCommandInput;

				const command = new PutObjectCommand(form);
				await s3Client.send(command);
			}
		}

		const profilePhoto = body.get("icon") as File;
		const profilePhotoId = randomUUID().toString();

		let icon;

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
					type: body.get("iconType"),
					value: profilePhotoId,
				};
				break;
			default:
				icon = {
					type: body.get("iconType"),
					value: body.get("icon"),
				};
		}

		const workspacesAllowed = body.get("workspacesAllowed");
		const workspacesAllowedIds = workspacesAllowed
			? JSON.parse(workspacesAllowed as string).map(
					(id: string) => new mongoose.Types.ObjectId(id),
				)
			: [];

		const application = await Applications.create({
			name: body.get("name"),
			cta: body.get("cta"),
			description: body.get("description"),
			avatarSrc: profilePhoto ? profilePhotoId : null,
			avatarFallback: body.get("name").slice(0, 2),
			icon,
			applicationUrl: body.get("iframeUrl"),
			workspacesAllowed: [],
			galleryPhotos: galleryPhotosIds,
			workspaceAccess: body.get("category"),
			priceId: body.get("priceId"),
			fields: JSON.parse(body.get("fields") as string),
			applicationUrlType: body.get("applicationUrlType"),
			configurationOptions: JSON.parse(
				body.get("configurationOptions") as string,
			),
		});

		return NextResponse.json(application);
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e?.message }, { status: 500 });
	}
}

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		const user = await User.findOne({ email: session.user.email });
		if (user.email.split("@")[1] !== config.domainName) {
			return NextResponse.json(
				{ error: "You have no permission" },
				{ status: 403 },
			);
		}

		await connectMongo();

		const applications = await Applications.find();

		return NextResponse.json(applications);
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e?.message }, { status: 500 });
	}
}
