"use client";

import { AvatarSelector } from "@/components/avatar-selector";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { base64ToBlob } from "@/lib/utils";
import { api } from "@/libs/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { WorkspaceAccessRadio } from "./_components/workspace-access-radio";

type Input = {
  name: string;
  cta: string;
  title: string;
  file: string;
  iframeUrl: string;
  description: string;
  titleDescription: string;
  profilePhoto: FormData | string;
  galeryPhotos: string;
  priceId?: string;
};

export default function AdminPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Input>();
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const queryClient = useQueryClient();
  const [icon, setIcon] = useState<FormData>(null);
  const [imageUrlWithoutS3, setImageUrlWithoutS3] = useState<string>("");
  const [emojiAvatar, setEmojiAvatar] = useState<string>("");
  const [category, setCategory] = useState<string>("free");

  const saveApplicationMutation = useMutation({
    mutationFn: async (data: FormData) => api.post("/api/applications", data),
    onSuccess: async (data) => {
      reset();
      setSharedWith([]);
      queryClient.refetchQueries({
        queryKey: ["workspace"],
        type: "all",
      });
      toast({
        description: "Application saved successfully.",
        duration: 5000,
      });
      setImageUrlWithoutS3(null);
      setEmojiAvatar(null);
      setCategory("free");
    },
    onError: () => {
      toast({
        description: "Something went wrong.",
        duration: 5000,
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<Input> = async (data) => {
    const formData = new FormData();

    if (category != "buyable") {
      data.priceId = null;
    }

    formData.append("name", data.name);
    formData.append("cta", data.cta);
    formData.append("title", data.title);
    formData.append("iframeUrl", data.iframeUrl);
    formData.append("description", data.description);
    formData.append("titleDescription", data.titleDescription);
    formData.append("workspacesAllowed", JSON.stringify(sharedWith));
    formData.append("icon", icon.get("icon") as File);
    formData.append("iconType", icon.get("iconType") as string);
    formData.append("category", category);
    formData.append("priceId", data.priceId);

    const galeryPhotos = data.galeryPhotos as unknown as FileList;
    if (galeryPhotos && galeryPhotos.length > 0) {
      Array.from(galeryPhotos).forEach((file) => {
        formData.append("galeryPhotos", file);
      });
    }

    saveApplicationMutation.mutate(formData);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && currentInput.trim() !== "") {
      event.preventDefault();
      setSharedWith((prev) => [...prev, currentInput.trim()]);
      setCurrentInput("");
    }
  };

  const handleRemoveBadge = (index: number) => {
    setSharedWith((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAvatarChange = (avatar: {
    value: string;
    type: "image" | "emoji";
  }) => {
    const formData = new FormData();

    switch (avatar.type) {
      case "image":
        const blob = base64ToBlob(avatar.value);
        formData.append("icon", blob, "avatar.jpeg");
        formData.append("iconType", avatar.type);

        const imageUrl = URL.createObjectURL(blob);
        setImageUrlWithoutS3(imageUrl);
        setEmojiAvatar(null);
        break;

      case "emoji":
        formData.append("icon", avatar.value);
        formData.append("iconType", avatar.type);
        setImageUrlWithoutS3(null);
        setEmojiAvatar(avatar.value);
        break;
    }

    setIcon(formData);
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
              <BreadcrumbPage>Administração de aplicativos</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Criar produto</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-col  items-center p-10">
        <form
          className="w-full max-w-3xl space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-2xl">Adicionar produto</h1>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>Foto de perfil do app</p>
              <span className="text-sm text-muted-foreground">
                Digite o nome que será mostrado publicamente como identificação
                do seu workspace em todas as interações na plataforma.
              </span>
            </div>
            <div className="flex justify-center">
              {/* <Input
              className="cursor-pointer"
              placeholder="Nome..."
              type="file"
              {...register("profilePhoto")}
              disabled={isSubmitting}
            /> */}
              <AvatarSelector
                data={
                  emojiAvatar ? { value: emojiAvatar, type: "emoji" } : null
                }
                className="w-[100px]"
                emojiSize="4rem"
                imageUrlWithoutS3={imageUrlWithoutS3 ? imageUrlWithoutS3 : null}
                onAvatarChange={handleAvatarChange}
              />
            </div>
          </section>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>Fotos galeria do app</p>
              <span className="text-sm text-muted-foreground">
                Digite o nome que será mostrado publicamente como identificação
                do seu workspace em todas as interações na plataforma.
              </span>
            </div>
            <div className="flex justify-end ">
              <Input
                className="cursor-pointer"
                placeholder="Nome..."
                type="file"
                multiple
                {...register("galeryPhotos")}
                disabled={isSubmitting}
              />
            </div>
          </section>
          <Separator />

          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>
                Nome da aplicação <span className="text-red-400">*</span>
              </p>
              <span className="text-sm text-muted-foreground">
                Digite o nome que será mostrado publicamente como identificação
                do seu workspace em todas as interações na plataforma.
              </span>
            </div>
            <div className="flex justify-end">
              <Input
                placeholder="Nome..."
                {...register("name", { required: true })}
                disabled={isSubmitting}
              />
            </div>
          </section>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>
                Categoria<span className="text-red-400">*</span>
              </p>
              <span className="text-sm text-muted-foreground">
                Digite o nome que será mostrado publicamente como identificação
                do seu workspace em todas as interações na plataforma.
              </span>
            </div>
            <div className="flex">
              <WorkspaceAccessRadio value={category} setValue={setCategory} />
            </div>
          </section>
          <Separator />

          {category == "buyable" && (
            <>
              <section className="grid grid-cols-2 gap-8 py-5">
                <div>
                  <p>
                    Price id <span className="text-red-400">*</span>
                  </p>
                  <span className="text-sm text-muted-foreground">
                    Digite o nome que será mostrado publicamente como
                    identificação do seu workspace em todas as interações na
                    plataforma.
                  </span>
                </div>
                <div className="flex justify-end">
                  <Input
                    placeholder="Price id..."
                    {...register("priceId", { required: true })}
                    disabled={isSubmitting}
                  />
                </div>
              </section>
              <Separator />
            </>
          )}
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>
                Cta da aplicação <span className="text-red-400">*</span>
              </p>
              <span className="text-sm text-muted-foreground">
                Digite o nome que será mostrado publicamente como identificação
                do seu workspace em todas as interações na plataforma.
              </span>
            </div>
            <div className="flex justify-end">
              <Input
                placeholder="Cta..."
                {...register("cta", { required: true })}
                disabled={isSubmitting}
              />
            </div>
          </section>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>
                Descrição da aplicação <span className="text-red-400">*</span>
              </p>
              <span className="text-sm text-muted-foreground">
                Digite o nome que será mostrado publicamente como identificação
                do seu workspace em todas as interações na plataforma.
              </span>
            </div>
            <div className="flex justify-end">
              <Textarea
                placeholder="Descrição da aplicação..."
                className="resize-none"
                {...register("description", { required: true })}
                disabled={isSubmitting}
              />
            </div>
          </section>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>
                Título da descrição <span className="text-red-400">*</span>
              </p>
              <span className="text-sm text-muted-foreground">
                Digite o nome que será mostrado publicamente como identificação
                do seu workspace em todas as interações na plataforma.
              </span>
            </div>
            <div className="flex justify-end">
              <Input
                placeholder="Título da descrição..."
                {...register("titleDescription", { required: true })}
                disabled={isSubmitting}
              />
            </div>
          </section>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>
                URL para Iframe <span className="text-red-400">*</span>
              </p>
              <span className="text-sm text-muted-foreground">
                Digite o nome que será mostrado publicamente como identificação
                do seu workspace em todas as interações na plataforma.
              </span>
            </div>
            <div className="flex justify-end">
              <Input
                placeholder="URL para Iframe..."
                {...register("iframeUrl", { required: true })}
                disabled={isSubmitting}
              />
            </div>
          </section>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>Compartilhar com</p>
              <span className="text-sm text-muted-foreground">
                Digite o id do workspace e pressione Enter para adicionar à
                lista.
              </span>
            </div>
            <div className="flex flex-col items-end">
              <Input
                placeholder="Digite e pressione Enter..."
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
              />
              <div className="mt-2 flex flex-wrap">
                {sharedWith.map((value, index) => (
                  <Badge key={index} className="mr-2 mb-2">
                    {value}
                    <button
                      type="button"
                      onClick={() => handleRemoveBadge(index)}
                      className="ml-1 text-white"
                    >
                      &times;
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </section>

          <div className="flex justify-end max-w-3xl items-center mt-20 w-full">
            <Button
              type="submit"
              disabled={isSubmitting || saveApplicationMutation.isPending}
            >
              Publicar
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
