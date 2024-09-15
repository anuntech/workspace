"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export function SetNameForm() {
  const { isPending, data } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  const [nameInput, setNameInput] = useState(data?.name);
  const router = useRouter();

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!nameInput) {
      return;
    }

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: nameInput }),
    });

    if (res.ok) {
      await createFirstWorkspace(nameInput);
      router.push("/");
      return;
    }

    return;
  };

  return (
    <form className="w-full space-y-4">
      <Input
        type="text"
        name="name"
        value={nameInput}
        defaultValue={data?.name}
        onChange={(e) => setNameInput(e.target.value)}
        placeholder="Nome"
        className="py-6"
        autoFocus
        disabled={isPending}
      />
      <Button
        disabled={isPending}
        onClick={handleSubmit}
        type="submit"
        className="w-full py-6"
      >
        Continuar
      </Button>
    </form>
  );
}
