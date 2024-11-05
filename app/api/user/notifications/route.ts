import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Notifications from "@/models/Notification";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await connectMongo();

    const notifications = await Notifications.find({
      userId: session.user.id,
    });

    const notificationsMap = await Promise.all(
      notifications.map(async (v) => {
        const fromUser = await User.findOne({ _id: v.from });
        const workspace = await Workspace.findOne({ _id: v.workspaceId });
        return {
          id: v._id,
          user: fromUser?.name,
          avatar: fromUser?.image,
          icon: fromUser?.icon,
          message: `convidou você para o workspace ${workspace.name}`,
          isNew: v.isNew,
          isInvite: v.isInvite,
          time: formatDistanceToNow(new Date((v as any).updatedAt), {
            addSuffix: true,
            locale: ptBR,
          }),
        };
      })
    );

    return NextResponse.json(notificationsMap);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
