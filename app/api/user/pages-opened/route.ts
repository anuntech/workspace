import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import clientPromise from "@/libs/mongo";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    const body = await request.json();

    if (!["workspace", "invitation", "application"].includes(body.pageOpened)) {
      return NextResponse.json(
        { error: "pageOpened inválido" },
        { status: 400 }
      );
    }

    await connectMongo();

    const user = await User.findById(session?.user?.id);

    // if (user?.pagesOpened?.find((el: any) => el.name == body.pageOpened)) {
    //   return NextResponse.json(
    //     { error: "pageOpened already added" },
    //     { status: 400 }
    //   );
    // }

    if (!user?.pagesOpened) {
      user.pagesOpened = [];
    }

    user?.pagesOpened?.push({
      name: body.pageOpened,
    });

    await user.save();

    return NextResponse.json(user);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
