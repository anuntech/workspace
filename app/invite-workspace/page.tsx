import Link from "next/link";
import Image from "next/image";
import { InviteWorkspaceForm } from "./_components/invite-workspace-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import config from "@/config";
import { redirect } from "next/navigation";

export default async function InviteWorkspacePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(config.auth.loginUrl);
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex justify-end px-8 py-5">
        <Link href="/help" className="hover:underline">
          Ajuda
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-8">
        <Image
          src="/anuntech-logo.svg"
          alt="Logotipo da Anuntech"
          width={50}
          height={50}
          priority
        />
        <div className="flex w-full max-w-sm flex-col items-center">
          <h1 className="mb-8 text-center text-2xl font-bold text-primary">
            Convite para participar do workspace
          </h1>
          <section className="w-full space-y-4">
            <InviteWorkspaceForm />
          </section>
        </div>
      </main>
    </div>
  );
}
