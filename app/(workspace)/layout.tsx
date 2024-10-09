import { getServerSession } from "next-auth";
import { Sidebar } from "./_components/sidebar";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import config from "@/config";
import { env } from "process";
import { RedirectNoneWorkspace } from "@/libs/redirect-none-workspace";

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(config.auth.loginUrl);
  }

  return (
    <div className="grid h-screen grid-cols-[230px_1fr] overflow-hidden bg-zinc-50 py-3 pr-3">
      <RedirectNoneWorkspace>
        <Sidebar />
        <main className="overflow-auto rounded-md border bg-white">
          {children}
        </main>
      </RedirectNoneWorkspace>
    </div>
  );
}
