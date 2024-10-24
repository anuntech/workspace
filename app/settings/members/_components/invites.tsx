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
import { toast } from "@/hooks/use-toast";
import { getS3Image } from "@/libs/s3-client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type InsertEmailInputs = {
  email: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  customerId: string;
  priceId: string;
  hasAccess: boolean;
  icon?: {
    type: "image" | "emoji";
    value: string;
  };
};

export function Invites() {
  const searchParams = useSearchParams();

  const { data } = useQuery<User[]>({
    queryKey: ["workspace/invite"],
    queryFn: () =>
      fetch(`/api/workspace/invite/${searchParams.get("workspace")}`).then(
        (res) => res.json()
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (data: { workspaceId: string; email: string }) =>
      fetch("/api/workspace/invite", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["workspace/invite"],
        type: "active",
      });
    },
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
    onSuccess: async (data) => {
      if (data.status == 200) {
        await queryClient.refetchQueries({
          queryKey: ["workspace/invite"],
        });

        toast({
          description: "Convite enviado com sucesso!",
          duration: 7000,
        });

        reset();
      }
    },
  });

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<InsertEmailInputs>();

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

      {inviteMutation?.data?.status == 404 && (
        <p className="text-sm text-destructive">Usuário não encontrado</p>
      )}
      {inviteMutation?.data?.status >= 400 &&
        inviteMutation?.data?.status != 404 && (
          <p className="text-sm text-destructive">
            Ocorreu um erro inesperado ao enviar o convite
          </p>
        )}
      <form className="flex gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Insira o e-mail para convidar..."
          disabled={isSubmitting}
          {...register("email", { required: true })}
        />
        <Button
          type="submit"
          disabled={deleteMutation.isPending || inviteMutation.isPending}
        >
          Enviar convite
        </Button>
      </form>
      <Separator />
      {data?.map((user) => {
        return (
          <div
            key={user.id}
            className="flex items-center justify-between space-x-4"
          >
            <div className="flex items-center space-x-4">
              {user.icon && (
                <div className="text-[1.3rem]">
                  {user.icon.type == "emoji" ? (
                    user.icon.value
                  ) : (
                    <Image
                      className="rounded-full"
                      width={54}
                      height={54}
                      src={getS3Image(user.icon.value)}
                      alt=""
                    />
                  )}
                </div>
              )}
              {!user.icon && (
                <Avatar className="size-10">
                  <AvatarImage src={user?.image || "/shad.png"} alt="@shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              )}
              <div>
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
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
                    Esta ação não pode ser desfeita. Isso excluirá
                    permanentemente o membro de seu workspace.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteMutation.mutate({
                        workspaceId: searchParams.get("workspace"),
                        email: user.email,
                      })
                    }
                  >
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      })}
    </div>
  );
}
