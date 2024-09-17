"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type InsertEmailInputs = {
  email: string;
};

export function Invites() {
  const { isPending, data, isSuccess } = useQuery({
    queryKey: ["workspace/invite"],
    queryFn: () => fetch("/api/workspace/invite").then((res) => res.json()),
  });

  const deleteMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/workspace/invite", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
  });

  const inviteMutation = useMutation({
    mutationFn: (data: { email: string; workspaceId: string }) =>
      fetch("/api/workspace/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InsertEmailInputs>();

  const searchParams = useSearchParams();

  const onSubmit: SubmitHandler<InsertEmailInputs> = async ({ email }) => {
    inviteMutation.mutate({
      email,
      workspaceId: searchParams.get("workspace"),
    });
  };

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-lg font-bold">Convidar para o workspace</h2>
        <span className="text-sm text-zinc-500">
          Convide os membros da sua equipe para colaborar.
        </span>
      </section>
      <form className="flex gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Insira o e-mail para convidar..."
          disabled={isSubmitting}
          {...register("email", { required: true })}
        />
        <Button type="submit">Enviar convite</Button>
      </form>
      <Separator />
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/shad.png" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">Vinicius Domene</p>
            <p className="text-sm text-muted-foreground">
              vinicius-domene@watecservice.com
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="group hover:border-red-500 hover:bg-red-50"
            >
              <Trash2 className="size-4 group-hover:text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente o
                membro de seu workspace.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction>Continuar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/shad.png" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">Alexandre Domene</p>
            <p className="text-sm text-muted-foreground">
              alexandre-domene@watecservice.com
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="group hover:border-red-500 hover:bg-red-50"
            >
              <Trash2 className="size-4 group-hover:text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente o
                membro de seu workspace.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction>Continuar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
