import config from "@/config";
import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { s3Client } from "@/libs/s3-client";
import Applications from "@/models/Applications";
import User from "@/models/User";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		const user = await User.findById(session.user.id);

		if (user.email.split("@")[1] !== config.domainName) {
			return NextResponse.json(
				{ error: "You have no permission" },
				{ status: 403 }
			);
		}

		await connectMongo();

		const formData = await request.formData();

		if (formData === null) return NextResponse.json(
			{ error: "Data not found" },
			{ status: 404 }
		);

		const galleryPhotos = formData.getAll("galeryPhotos");
		const galleryPhotosIds = [] as Array<string>;

		if (galleryPhotos && galleryPhotos.length > 0) {
			for (const photo of Array.from(galleryPhotos)) {
				const photoType = Object.prototype.toString.call(photo)

				if (photoType === "[object File]") {
					const file = photo as File;
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

					break
				}

				if (photoType === "[object String]") {
					const photoId = photo as string;

					galleryPhotosIds.push(photoId);
				}
			}
		}

		const profilePhoto = formData.get("icon") as File;
		const profilePhotoId = randomUUID().toString();

		let icon;

		switch (formData.get("iconType")) {
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
					type: formData.get("iconType"),
					value: profilePhotoId,
				};
				break;
			default:
				icon = {
					type: formData.get("iconType"),
					value: formData.get("icon"),
				};
		}

		const application = await Applications.findByIdAndUpdate(formData.get("id"),
			{
				name: formData.get("name"),
				cta: formData.get("subtitle"),
				description: formData.get("description"),
				avatarSrc: profilePhoto ? profilePhotoId : null,
				avatarFallback: formData.get("name").slice(0, 2),
				icon,
				galleryPhotos: galleryPhotosIds,
			},
			{
				new: true,
			}
		);

		if (application === null) return NextResponse.json(
			{ error: "Application not found" },
			{ status: 404 }
		);

		return NextResponse.json(application, {
			status: 200
		});
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: e?.message }, { status: 500 });
	}
}
