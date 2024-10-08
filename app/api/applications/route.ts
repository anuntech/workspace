import conf from "@/config";
import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import { s3Client } from "@/libs/s3-client";
import Applications from "@/models/Applications";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

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

    const application = await Applications.create({
      name: body.get("name"),
      cta: body.get("cta"),
      description: body.get("description"),
      descriptionTitle: body.get("descriptionTitle"),
      avatarSrc: "/shad.png",
      avatarFallback: body.get("name").slice(0, 1),
      applicationUrl: body.get("iframeUrl"),
      workspacesAllowed: JSON.parse(
        body.get("workspacesAllowed") as string
      ).map((id: string) => new mongoose.Types.ObjectId(id)),
    });
    const profilePhoto = body.get("profilePhoto") as File;

    if (profilePhoto) {
      const form = {
        Bucket: process.env.HETZNER_BUCKET_NAME!,
        Key: randomUUID().toString(),
        Body: Buffer.from(await profilePhoto.arrayBuffer()),
        ContentType: profilePhoto.type,
      };

      const command = new PutObjectCommand(form);
      await s3Client.send(command);
    }

    return NextResponse.json(application);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
