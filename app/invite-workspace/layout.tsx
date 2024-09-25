import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return children;
}
