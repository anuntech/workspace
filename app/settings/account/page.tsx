"use client";

import { AvatarSelector } from "@/components/avatar-selector";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "@/hooks/use-toast";
import { base64ToBlob } from "@/lib/utils";
import api from "@/libs/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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

type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  customerId: string;
  priceId: string;
  hasAccess: boolean;
};

export default function AccountPage() {
  const {
    isPending,
    data: user,
    isSuccess,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<User>();

  useEffect(() => {
    if (!isSuccess) return;

    setValue("name", user?.name);
    setValue("email", user?.email);
    setValue("image", user?.image);
  }, [isSuccess]);

  const [isChanged, setIsChanged] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: User) =>
      fetch("/api/user", {
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

  const onSubmit: SubmitHandler<User> = async (data) => {
    if (!data.name) {
      return;
    }

    mutation.mutate(data);
  };

  const queryClient = useQueryClient();

  const changeUserAvatarMutation = useMutation({
    mutationFn: async (data: any) => api.patch("/api/user/icon", data),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["user"],
        type: "all",
      });
      toast({
        title: "Avatar atualizado",
        description: "O avatar do usuário foi alterado com sucesso.",
        duration: 5000,
      });
    },
    onError: async () => {
      toast({
        title: "Erro ao atualizar avatar",
        description:
          "Ocorreu um erro ao atualizar o avatar do usuário. O limite do arquivo é de 10MB.",
        duration: 5000,
        variant: "destructive",
      });
    },
  });

  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  const handleAvatarChange = (avatar: {
    value: string;
    type: "image" | "emoji";
  }) => {
    const formData = new FormData();

    switch (avatar.type) {
      case "image":
        formData.append("icon", base64ToBlob(avatar.value), "avatar.jpeg");
        formData.append("iconType", avatar.type);
        formData.append("workspaceId", workspace);
        break;
      case "emoji":
        formData.append("icon", avatar.value);
        formData.append("iconType", avatar.type);
        formData.append("workspaceId", workspace);
        break;
    }

    changeUserAvatarMutation.mutate(formData);
  };

  return (
    <>
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Minha conta</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Meu perfil</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-col items-center p-10">
        <div className="w-full max-w-3xl space-y-5">
          <form action="POST" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-2xl">Minhas configurações</h1>
            <Separator />
            <section className="grid grid-cols-2 gap-8 py-5">
              <div>
                <p>Avatar</p>
                <span className="text-sm text-muted-foreground">
                  Isso será exibido no seu perfil público.
                </span>
              </div>
              <div className="flex justify-center w-full">
                <div className="flex justify-center w-28 h-28">
                  <AvatarSelector
                    emojiSize="70px"
                    data={user?.icon}
                    imageUrlWithoutS3={!user?.icon ? user?.image : undefined}
                    onAvatarChange={handleAvatarChange}
                  />
                </div>
              </div>
            </section>
            <Separator />
            <section className="grid grid-cols-2 gap-8 py-5">
              <div>
                <p>Nome</p>
                <span className="text-sm text-muted-foreground">
                  Isso será exibido no seu perfil público.
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
            {/* <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>Nome de usuário</p>
              <span className="text-sm text-muted-foreground">
                Isso será exibido no seu perfil público.
              </span>
            </div>
            <div className="flex justify-end">
              <Input
                placeholder="Nome de usuário..."
                {...register("name", { required: true })}
                onChange={() => setIsChanged(true)}
                disabled={isPending || isSubmitting}
              />
            </div>
          </section> */}
            <Separator />
            <section className="grid grid-cols-2 gap-8 py-5">
              <div>
                <p>E-mail</p>
                <span className="text-sm text-muted-foreground">
                  Seu e-mail é usado para entrar na sua conta e para nós
                  enviarmos comunicações importantes.
                </span>
              </div>
              <div className="flex justify-end">
                <Input
                  placeholder="E-mail..."
                  {...register("email", { required: true })}
                  onChange={() => setIsChanged(true)}
                  disabled={true}
                />
              </div>
            </section>
            <Separator />
            <section className="grid grid-cols-2 gap-8 py-5">
              <div>
                <p className="text-red-500">Deletar conta</p>
                <span className="text-sm text-muted-foreground">
                  Essa ação é irreversível e resultará na perda de todos os seus
                  dados e acessos.
                </span>
              </div>
              <div className="flex justify-end">
                <DeleteAccountDialog />
              </div>
            </section>
            <div className="flex justify-end max-w-3xl items-center mt-20 w-full">
              <Button type="submit" disabled={!isChanged || isSubmitting}>
                Salvar as alterações
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

const DeleteAccountDialog = ({ isOpen, onClose, onDelete }: any) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive">
          Deletar conta
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Exclusão de Conta</AlertDialogTitle>
          <AlertDialogDescription>
            Para prosseguir com a exclusão da sua conta, entre em contato com o
            suporte da Anuntech pelo e-mail:{" "}
            <a
              href="mailto:hi@anuntech.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              hi@anuntech.com
            </a>
            . Nossa equipe está pronta para ajudar você.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Ok</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
