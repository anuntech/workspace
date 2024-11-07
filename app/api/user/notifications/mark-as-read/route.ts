import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Notifications from "@/models/Notification";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await connectMongo();

    const result = await Notifications.updateMany(
      {
        userId: session.user.id,
      },
      {
        isNew: false,
      }
    );

    return NextResponse.json({ updatedCount: result.matchedCount });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
