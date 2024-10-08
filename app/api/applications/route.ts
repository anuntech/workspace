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

    const profilePhoto = body.get("profilePhoto") as File;
    const profilePhotoId = randomUUID().toString();

    if (profilePhoto) {
      const form = {
        Bucket: process.env.HETZNER_BUCKET_NAME!,
        Key: profilePhotoId,
        Body: Buffer.from(await profilePhoto.arrayBuffer()),
        ContentType: profilePhoto.type,
        ACL: "public-read",
      } as PutObjectCommandInput;

      const command = new PutObjectCommand(form);
      const data = await s3Client.send(command);
      console.log(data);
    }

    const application = await Applications.create({
      name: body.get("name"),
      cta: body.get("cta"),
      description: body.get("description"),
      descriptionTitle: body.get("descriptionTitle"),
      avatarSrc: profilePhoto ? profilePhotoId : "/shad.png",
      avatarFallback: body.get("name").slice(0, 1),
      applicationUrl: body.get("iframeUrl"),
      workspacesAllowed: JSON.parse(
        body.get("workspacesAllowed") as string
      ).map((id: string) => new mongoose.Types.ObjectId(id)),
    });

    return NextResponse.json(application);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
