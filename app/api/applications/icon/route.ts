import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { isValidEmoji } from "@/libs/icons";
import { randomUUID } from "crypto";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "@/libs/s3-client";
import mongoose from "mongoose";
import imageType from "image-type";
import Applications from "@/models/Applications";
import User from "@/models/User";
import config from "@/config";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    await connectMongo();
    const user = await User.findOne({ email: session.user.email });
    if (user.email.split("@")[1] !== config.domainName) {
      return NextResponse.json(
        { error: "You have no permission" },
        { status: 403 }
      );
    }

    const body = await request.formData();

    const applicationId = body.get("applicationId") as string;
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    const iconType = body.get("iconType") as string;
    const allowedIconTypes = ["image", "emoji"];
    if (!allowedIconTypes.includes(iconType)) {
      return NextResponse.json({ error: "Invalid icon type" }, { status: 400 });
    }

    const application = await Applications.findById(applicationId);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    switch (iconType) {
      case "image": {
        const file = body.get("icon") as File;

        if (!file) {
          return NextResponse.json(
            { error: "No file uploaded" },
            { status: 400 }
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
            { status: 400 }
          );
        }

        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json(
            { error: "File size exceeds 10MB" },
            { status: 400 }
          );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const type = await imageType(buffer);

        if (!type || !allowedMimeTypes.includes(type.mime)) {
          return NextResponse.json(
            { error: "Invalid image file" },
            { status: 400 }
          );
        }

        const uniqueId = `${applicationId}-${randomUUID()}`;

        const form = {
          Bucket: process.env.NEXT_PUBLIC_HETZNER_BUCKET_NAME!,
          Key: uniqueId,
          Body: buffer,
          ContentType: file.type,
          ACL: "public-read",
        } as PutObjectCommandInput;

        const command = new PutObjectCommand(form);
        await s3Client.send(command);

        application.icon.type = "image";
        application.icon.value = uniqueId;
        break;
      }
      case "emoji": {
        const icon = body.get("icon") as string;
        if (!icon || !isValidEmoji(icon)) {
          return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
        }

        application.icon.type = "emoji";
        application.icon.value = icon;
        break;
      }
      default:
        return NextResponse.json(
          { error: "Invalid icon type" },
          { status: 400 }
        );
    }

    await application.save();

    return NextResponse.json(application);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
