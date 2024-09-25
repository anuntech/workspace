import connectMongo from "@/libs/mongoose";
import { authOptions } from "@/libs/next-auth";
import Applications from "@/models/Applications";
import MyApplications from "@/models/MyApplications";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    await connectMongo();

    const applications = await Applications.find();

    const applicationsEnabledOrDisabled = await Promise.all(
      applications.map(async (app) => {
        const isEnabled = await MyApplications.findOne({
          userId: session.user.id,
          applicationId: app.id,
        });

        return {
          ...app.toObject(),
          status: isEnabled ? "enabled" : "disabled",
        };
      })
    );

    return NextResponse.json(applicationsEnabledOrDisabled);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
