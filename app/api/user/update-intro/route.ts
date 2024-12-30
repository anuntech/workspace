import { getServerSession } from "next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User"; // Seu modelo de usuário
import { authOptions } from "@/libs/next-auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Não autenticado", { status: 401 });
  }

  await connectMongo();

  await User.updateOne(
    { email: session.user.email },
    { $set: { showCompleteIntro: false } }
  );

  return new Response("OK");
}