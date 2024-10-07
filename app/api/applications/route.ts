import config from "@/config";
import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import Applications from "@/models/Applications";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    console.log(session.user.email.split("@"), config.domainName);
    // if (session.user.email.split("@")[1] !== config.domainName) {
    //   return NextResponse.json(
    //     { error: "You have no permission" },
    //     { status: 403 }
    //   );
    // }

    await connectMongo();

    const body = await request.json();

    const application = await Applications.create({
      name: body.name,
      cta: body.cta,
      description: body.description,
      descriptionTitle: body.descriptionTitle,
      avatarSrc: "/shad.png",
      avatarFallback: body.name.slice(0, 1),
      applicationUrl: body.iframeUrl,
      workspacesAllowed: body.workspacesAllowed.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      ),
    });

    return NextResponse.json(application);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
