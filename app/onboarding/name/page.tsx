"use client";

import { useEffect, useState } from "react";
import { SetNameForm } from "./_components/set-name-form";
import { useRouter } from "next/navigation";

export default function NamePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createFirstWorkspace = async (name: string) => {
      const getRes = await fetch(`/api/workspace`);
      const isThereAnyWorkspace = await getRes.json();
      if (isThereAnyWorkspace.length > 0) {
        return;
      }

      await fetch(`/api/workspace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name + "'s Workspace",
          icon: "apple",
        }),
      });
    };

    const res = async () => {
      setLoading(true);
      const res = await fetch(`/api/user`);
      const json = await res.json();

      const workspaces = await fetch(`/api/workspace`);
      const workspaceJson = await workspaces.json();

      if (json?.name) {
        if (workspaceJson.length == 0) {
          await createFirstWorkspace(json.name);
        }

        router.push("/");
      }
      setLoading(false);
    };

    res();
  }, []);

  return loading ? (
    <div>Carregando...</div>
  ) : (
    <div className="flex w-full max-w-sm flex-col items-center">
      <h1 className="mb-8 text-2xl font-bold text-primary">Defina seu nome</h1>
      <section className="w-full space-y-4">
        <SetNameForm />
      </section>
    </div>
  );
}
