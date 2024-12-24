"use client";

import { IconComponent } from "@/components/get-lucide-icons";
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
import api from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { RotateCcw, Trash2 } from "lucide-react";
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
    type: "image" | "emoji" | "lucide";
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

  console.log(data);

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
    mutationFn: async (data: { email: string; workspaceId: string }) =>
      await api.post("/api/workspace/invite", data),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["workspace/invite"],
      });

      toast({
        description: "Convite enviado com sucesso!",
        duration: 5000,
      });

      reset();
    },
    onError: (data: AxiosError) => {
      toast({
        description: (data.response.data as any).error,
        duration: 5000,
        variant: "destructive",
      });
      reset();
    },
  });

  const queryClient = useQueryClient();

  const resendMutation = useMutation({
    mutationFn: (data: { email: string; workspaceId: string }) =>
      api.post(`/api/workspace/invite/resend`, data),
    onSuccess: () => {
      toast({
        title: "Convite reenviado",
        description: "O convite foi reenviado com sucesso.",
        duration: 5000,
      });
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Erro ao reenviar convite",
        description: (err.response.data as any)?.error,
        duration: 5000,
        variant: "destructive",
      });
    },
  });

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
              {!user?.icon && (
                <Avatar className="size-10">
                  <AvatarImage src={user?.image || "/shad.png"} alt="@shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              )}
              {user?.icon?.type === "emoji" && (
                <span className="text-[1.3rem]">{user.icon.value}</span>
              )}
              {user?.icon?.type === "image" && (
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={getS3Image(user?.icon?.value) || "/shad.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback className="rounded-lg">SC</AvatarFallback>
                </Avatar>
              )}
              {user?.icon?.type === "lucide" && (
                <span className="text-[2rem] w-full h-full flex size-10">
                  <IconComponent className="size-10" name={user?.icon.value} />
                </span>
              )}

              <div>
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="space-x-2">
              <Button
                title="Reenviar"
                variant="outline"
                size="icon"
                onClick={() =>
                  resendMutation.mutate({
                    email: user.email,
                    workspaceId: searchParams.get("workspace"),
                  })
                }
                disabled={resendMutation.isPending}
              >
                <RotateCcw />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="group hover:border-red-500 hover:bg-red-50"
                    title="Deletar"
                    disabled={resendMutation.isPending}
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
          </div>
        );
      })}
    </div>
  );
}
