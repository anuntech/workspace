import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Workspace from "@/models/Workspace";
import { isValidEmoji } from "@/libs/icons";
import { randomUUID } from "crypto";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "@/libs/s3-client";

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

    const body = await request.formData();

    const workspace = await Workspace.findById(body.get("workspaceId"));

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const admin =
      workspace.members.find(
        (val) => val.memberId.toString() === session.user.id.toString()
      )?.role == "admin";
    const owner = workspace.owner.toString() == session.user.id.toString();

    if (!admin && !owner) {
      return NextResponse.json(
        { error: "You are not authorized to perform this action" },
        { status: 403 }
      );
    }

    const iconType = body.get("iconType");

    switch (iconType) {
      case "image":
        const file = body.get("icon") as File;

        if (!file) {
          return NextResponse.json(
            { error: "No file uploaded" },
            { status: 400 }
          );
        }

        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json(
            { error: "File size exceeds 10MB" },
            { status: 400 }
          );
        }

        const id = randomUUID().toString();

        const form = {
          Bucket: process.env.NEXT_PUBLIC_HETZNER_BUCKET_NAME!,
          Key: id,
          Body: Buffer.from(await file.arrayBuffer()),
          ContentType: file.type,
          ACL: "public-read",
        } as PutObjectCommandInput;

        const command = new PutObjectCommand(form);
        await s3Client.send(command);

        workspace.icon.type = "image";
        workspace.icon.value = id;
        break;
      case "emoji":
        const isValid = isValidEmoji(body.get("icon") as string);
        if (!isValid) {
          return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
        }

        workspace.icon.type = "emoji";
        workspace.icon.value = body.get("icon") as string;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid icon type" },
          { status: 400 }
        );
    }

    await workspace.save();

    return NextResponse.json(workspace);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
