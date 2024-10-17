"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { initialWorkspaceIcons } from "@/libs/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function CreateWorkspaceForm() {
  const [name, setName] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const sendCreateWorkspaceEmail = useMutation({
    mutationFn: (data: any) =>
      fetch("/api/workspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
    onSuccess: async (data) => {
      if (data.status == 201) {
        await queryClient.refetchQueries({
          queryKey: ["workspace"],
          type: "all",
        });

        router.push(`/?workspace=${(await data.json()).id}`);
      }
    },
  });

  const handleCreateWorkspace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const randomIcon =
      initialWorkspaceIcons[
        Math.floor(Math.random() * initialWorkspaceIcons.length)
      ];
    const data = {
      name,
      icon: { type: "emoji", value: randomIcon },
    };

    sendCreateWorkspaceEmail.mutate(data);
  };

  return (
    <form
      action="/"
      method="POST"
      onSubmit={handleCreateWorkspace}
      className="w-full space-y-4"
    >
      <Input
        type="text"
        disabled={sendCreateWorkspaceEmail.isPending}
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do seu workspace..."
        className="py-6"
        autoFocus
      />
      <Button
        disabled={sendCreateWorkspaceEmail.isPending}
        type="submit"
        className="w-full py-6"
      >
        Continuar
      </Button>
    </form>
  );
}
