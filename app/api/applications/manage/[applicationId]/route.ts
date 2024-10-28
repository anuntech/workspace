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

export async function PATCH(
  request: Request,
  { params }: { params: { applicationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    const user = await User.findOne({ email: session.user.email });
    if (user.email.split("@")[1] !== config.domainName) {
      return NextResponse.json(
        { error: "You have no permission" },
        { status: 403 }
      );
    }
    await connectMongo();

    const { applicationId } = params;

    const application = await Applications.findById(applicationId);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const body = await request.formData();

    const galleryPhotos = body.getAll("galeryPhotos");
    let galleryPhotosIds = application.galleryPhotos || [];

    if (galleryPhotos && galleryPhotos.length > 0) {
      galleryPhotosIds = [];

      for (const file of Array.from(galleryPhotos) as File[]) {
        const id = `${applicationId}-${randomUUID()}`;
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
    let profilePhotoId = application.avatarSrc;

    if (profilePhoto) {
      profilePhotoId = `${applicationId}-${randomUUID()}`;

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

    application.name = body.get("name")?.toString() || application.name;
    application.cta = body.get("cta")?.toString() || application.cta;
    application.description =
      body.get("description")?.toString() || application.description;
    console.log(body.get("descriptionTitle"));
    application.descriptionTitle =
      body.get("descriptionTitle")?.toString() || application.descriptionTitle;
    application.avatarSrc = profilePhotoId;
    application.avatarFallback = application.name.slice(0, 2);
    application.applicationUrl =
      body.get("iframeUrl")?.toString() || application.applicationUrl;

    if (body.get("workspacesAllowed")) {
      application.workspacesAllowed = JSON.parse(
        body.get("workspacesAllowed") as string
      ).map((id: string) => new mongoose.Types.ObjectId(id));
    }

    application.galleryPhotos = galleryPhotosIds;

    await application.save();

    return NextResponse.json(application);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { applicationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    const user = await User.findOne({ email: session.user.email });
    if (user.email.split("@")[1] !== config.domainName) {
      return NextResponse.json(
        { error: "You have no permission" },
        { status: 403 }
      );
    }

    await connectMongo();

    const { applicationId } = params;

    const application = await Applications.findById(applicationId);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    await application.deleteOne();

    return NextResponse.json(application);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
