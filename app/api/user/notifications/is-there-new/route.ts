import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Notifications from "@/models/Notification";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await connectMongo();

    const notifications = await Notifications.find({
      userId: session.user.id,
    });

    const isThereNewNotification = notifications.find((v) => v.isNew);

    return NextResponse.json(!!isThereNewNotification);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
