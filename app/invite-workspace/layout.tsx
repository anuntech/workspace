import { getServerSession } from "next-auth";
import config from "@/config";
import { redirect } from "next/navigation";
import { authOptions } from "@/libs/next-auth";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(config.auth.loginUrl);
  }

  return children;
}
