import conf from "@/config";
import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { s3Client } from "@/libs/s3-client";
import Applications from "@/models/Applications";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    console.log(session.user.email.split("@"), conf.domainName);
    // if (session.user.email.split("@")[1] !== config.domainName) {
    //   return NextResponse.json(
    //     { error: "You have no permission" },
    //     { status: 403 }
    //   );
    // }

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

    const profilePhoto = body.get("profilePhoto") as File;
    const profilePhotoId = randomUUID().toString();

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

    const application = await Applications.create({
      name: body.get("name"),
      cta: body.get("cta"),
      description: body.get("description"),
      descriptionTitle: body.get("descriptionTitle"),
      avatarSrc: profilePhoto ? profilePhotoId : null,
      avatarFallback: body.get("name").slice(0, 2),
      applicationUrl: body.get("iframeUrl"),
      workspacesAllowed: JSON.parse(
        body.get("workspacesAllowed") as string
      ).map((id: string) => new mongoose.Types.ObjectId(id)),
      galleryPhotos: galleryPhotosIds,
    });

    return NextResponse.json(application);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
