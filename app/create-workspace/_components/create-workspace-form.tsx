"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { initialWorkspaceIcons } from "@/libs/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

export function CreateWorkspaceForm() {
  const [name, setName] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const sendCreateWorkspaceEmail = useMutation({
    mutationFn: (data: any) => api.post("/api/workspace", data),
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        queryKey: ["workspace"],
        type: "all",
      });

      router.push(`/?workspace=${(await data.data).id}`);
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Erro ao criar workspace",
        description: (err.response.data as any)?.error,
        variant: "destructive",
        duration: 7000,
      });
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
