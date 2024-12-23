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
import { AvatarSelector } from "../../components/avatar-selector";
import api from "@/libs/api";
import { toast } from "@/hooks/use-toast";
import { base64ToBlob } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loader, LoaderCircle } from "lucide-react";

type Workspace = {
  name?: string;
  id?: string;
  icon?: any;
  members?: any[];
  owner: string;
};

export default function SettingsPage() {
  const workspaceQuery = useQuery({
    queryKey: ["find-workspace"],
    queryFn: async () =>
      api.get(`/api/workspace/${workspace}`).then((res) => res.data),
  });

  const changeTutorialMutation = useMutation({
    mutationFn: () =>
      api.post("/api/workspace/tutorial", {
        pageOpened: "workspace",
        workspaceId: workspace,
      }),
  });

  useEffect(() => {
    if (
      workspaceQuery.isFetched &&
      !workspaceQuery.data?.tutorial?.includes("workspace")
    ) {
      changeTutorialMutation.mutate();
    }
  }, [workspaceQuery.isFetched]);

  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  const roleQuery = useQuery({
    queryKey: ["workspace/role"],
    queryFn: () =>
      fetch(`/api/workspace/role/${workspace}`).then((res) => res.json()),
  });

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (!workspaceQuery.isSuccess) return;
    const workspace = workspaceQuery.data;

    setValue("name", workspace?.name);
    setValue("icon", workspace?.icon);
    setValue("id", workspace?.id);
  }, [workspaceQuery.isSuccess]);

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

  const changeWorkspaceAvatarMutation = useMutation({
    mutationFn: async (data: any) => api.patch("/api/workspace/icon", data),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["workspace"],
        type: "all",
      });
      toast({
        title: "Avatar atualizado",
        description: "O avatar do workspace foi alterado com sucesso.",
        duration: 5000,
      });
    },
    onError: async () => {
      toast({
        title: "Erro ao atualizar avatar",
        description:
          "Ocorreu um erro ao atualizar o avatar do workspace. O limite do arquivo é de 10MB.",
        duration: 5000,
        variant: "destructive",
      });
    },
  });

  const handleAvatarChange = (avatar: {
    value: string;
    type: "image" | "emoji" | "lucide";
  }) => {
    const formData = new FormData();

    switch (avatar.type) {
      case "image": {
        const blob = base64ToBlob(avatar.value);
        const mimeType = blob.type;
        const extension = mimeType.split("/")[1]; // "png", "jpeg", etc.
        formData.append("icon", blob, `avatar.${extension}`);
        formData.append("iconType", avatar.type);
        formData.append("workspaceId", workspace);
        break;
      }
      case "emoji":
        formData.append("icon", avatar.value);
        formData.append("iconType", avatar.type);
        formData.append("workspaceId", workspace);
        break;

      case "lucide":
        formData.append("icon", avatar.value);
        formData.append("iconType", avatar.type);
        formData.append("workspaceId", workspace);
        break;
    }

    changeWorkspaceAvatarMutation.mutate(formData);
  };

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
      toast({ title: "Workspace atualizado com sucesso!" });
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
    <>
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Visão geral</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <form action="POST" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col  items-center p-10">
          <div className="w-full max-w-3xl space-y-5">
            <h1 className="text-2xl">Geral</h1>
            <Separator />
            <section className="grid grid-cols-2 gap-8 py-5">
              <div>
                <p>Avatar do workspace</p>
                <span className="text-sm text-muted-foreground">
                  Escolha um avatar que será visível para todos e representará
                  sua identidade digital.
                </span>
              </div>
              <div className="flex justify-center items-center w-full">
                <div className="flex justify-center w-28 h-28">
                  {workspaceQuery.isPending ||
                  changeWorkspaceAvatarMutation.isPending ? (
                    <Skeleton className="w-full h-full" />
                  ) : (
                    <AvatarSelector
                      emojiSize="70px"
                      data={workspaceQuery.data?.icon}
                      onAvatarChange={handleAvatarChange}
                    />
                  )}
                </div>
              </div>
            </section>
            <Separator />
            <section className="grid grid-cols-2 gap-8 py-5">
              <div>
                <p>Nome do workspace</p>
                <span className="text-sm text-muted-foreground">
                  Digite o nome que será mostrado publicamente como
                  identificação do seu workspace em todas as interações na
                  plataforma.
                </span>
              </div>
              <div className="flex justify-end">
                <Input
                  placeholder="Nome..."
                  {...register("name", { required: true })}
                  onChange={() => setIsChanged(true)}
                  disabled={
                    workspaceQuery.isPending ||
                    isSubmitting ||
                    mutation.isPending
                  }
                />
              </div>
            </section>
            <Separator />
            <section className="grid grid-cols-2 gap-8 py-5">
              <div>
                <p className="text-red-500">Deletar workspace</p>
                <span className="text-sm text-muted-foreground">
                  Cuidado! Deletar seu workspace é uma ação permanente que
                  removerá todos os dados, configurações e históricos
                  associados, sem possibilidade de recuperação.
                </span>
              </div>
              <div className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={
                        roleQuery.data?.role != "owner" || mutation.isPending
                      }
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
            <Button
              type="submit"
              disabled={!isChanged || isSubmitting || mutation.isPending}
            >
              {mutation.isPending && <LoaderCircle className="animate-spin" />}
              Salvar as alterações
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
