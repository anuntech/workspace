import Link from "next/link";
import Image from "next/image";
import { CreateWorkspaceForm } from "./_components/create-workspace-form";
import { authOptions } from "@/libs/next-auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import config from "@/config";

export default async function CreateWorkspacePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(config.auth.loginUrl);
  }

  return (
    <div className="flex h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center gap-8">
        <Image
          src="/anuntech-logo.svg"
          alt="Logotipo da Anuntech"
          width={50}
          height={50}
          priority
        />
        <div className="flex w-full max-w-sm flex-col items-center">
          <h1 className="mb-8 text-2xl font-bold text-primary">
            Criar Workspace
          </h1>
          <section className="w-full space-y-4">
            <CreateWorkspaceForm />
          </section>
        </div>
      </main>
    </div>
  );
}
