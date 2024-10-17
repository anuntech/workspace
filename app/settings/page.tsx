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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AvatarSelector } from "./_components/avatar-selector";
import api from "@/libs/api";

type Workspace = {
  name?: string;
  id?: string;
  icon?: any;
  members?: any[];
  owner: string;
};

export default function SettingsPage() {
  const { isPending, data, isSuccess } = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => api.get("/api/workspace"),
  });

  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  const roleQuery = useQuery({
    queryKey: ["workspace/role"],
    queryFn: () =>
      fetch(`/api/workspace/role/${workspace}`).then((res) => res.json()),
  });

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (!isSuccess) return;
    const workspace = data?.data.find(
      (workspace: any) => workspace.id === searchParams.get("workspace")
    );

    setValue("name", workspace?.name);
    setValue("icon", workspace?.icon);
    setValue("id", workspace?.id);
  }, [isSuccess]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<Workspace>();

  const queryClient = useQueryClient();

  const deleteWorkspaceMutation = useMutation({
    mutationFn: (data: { workspaceId: string }) =>
      fetch(`/api/workspace/${data.workspaceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["workspace"],
        type: "active",
      });
      router.push("/");
    },
  });

  const mutation = useMutation({
    mutationFn: (data: Workspace) =>
      fetch("/api/workspace", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      setIsChanged(false);
    },
  });

  const onSubmit: SubmitHandler<Workspace> = async (data) => {
    if (!data.name) {
      return;
    }

    mutation.mutate(data);
  };

  const router = useRouter();

  return (
    <form action="POST" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col  items-center p-10">
        <div className="w-full max-w-3xl space-y-5">
          <h1 className="text-2xl">Geral</h1>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>Avatar do workspace</p>
              <span className="text-sm text-muted-foreground">
                Escolha um avatar que será visível para todos e representará sua
                identidade digital.
              </span>
            </div>
            <div className="flex justify-end pr-12">
              <AvatarSelector />
            </div>
          </section>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>Nome do workspace</p>
              <span className="text-sm text-muted-foreground">
                Digite o nome que será mostrado publicamente como identificação
                do seu workspace em todas as interações na plataforma.
              </span>
            </div>
            <div className="flex justify-end">
              <Input
                placeholder="Nome..."
                {...register("name", { required: true })}
                onChange={() => setIsChanged(true)}
                disabled={isPending || isSubmitting}
              />
            </div>
          </section>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p className="text-red-500">Deletar workspace</p>
              <span className="text-sm text-muted-foreground">
                Cuidado! Deletar seu workspace é uma ação permanente que
                removerá todos os dados, configurações e históricos associados,
                sem possibilidade de recuperação.
              </span>
            </div>
            <div className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={roleQuery.data?.role != "owner"}
                  >
                    Deletar workspace
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá
                      permanentemente o seu workspace.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteWorkspaceMutation.mutate({
                          workspaceId: workspace,
                        });
                      }}
                    >
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </section>
        </div>
        <div className="flex justify-end max-w-3xl items-center mt-20 w-full">
          <Button type="submit" disabled={!isChanged || isSubmitting}>
            Salvar as alterações
          </Button>
        </div>
      </div>
    </form>
  );
}
