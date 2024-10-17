"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { api } from "@/libs/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

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
};

export default function AdminEditPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Input>();
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");

  const allAppsQuery = useQuery({
    queryKey: ["allApplications"],
    queryFn: async () => await api.get(`/api/applications`),
  });

  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("edit");

  const editApplicationMutation = useMutation({
    mutationFn: async (data: FormData) =>
      api.patch(`/api/applications/manage/${applicationId}`, data),
    onSuccess: async () => {
      reset();
      setSharedWith([]);
      queryClient.refetchQueries({
        queryKey: ["allApplications"],
        type: "all",
      });
      toast({
        description: "Aplicativo editado com sucesso.",
        duration: 5000,
      });
    },
    onError: () => {
      toast({
        description: "Algo deu errado.",
        duration: 5000,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (allAppsQuery.data) {
      setSharedWith(
        allAppsQuery.data.data.find((a: any) => a.id == applicationId)
          .workspacesAllowed
      );
    }
  }, [allAppsQuery.data]);

  if (allAppsQuery.isPending) {
    return <p>Carregando...</p>;
  }

  const application = allAppsQuery.data.data.find(
    (a: any) => a.id == applicationId
  );

  const onSubmit: SubmitHandler<Input> = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("cta", data.cta);
    formData.append("title", data.title);
    formData.append("iframeUrl", data.iframeUrl);
    formData.append("description", data.description);
    formData.append("descriptionTitle", data.titleDescription);
    formData.append("workspacesAllowed", JSON.stringify(sharedWith));

    const galeryPhotos = data.galeryPhotos as unknown as FileList;
    if (galeryPhotos && galeryPhotos.length > 0) {
      Array.from(galeryPhotos).forEach((file) => {
        formData.append("galeryPhotos", file);
      });
    }

    editApplicationMutation.mutate(formData);
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
  return (
    <div className="flex flex-col  items-center p-10">
      <form
        className="w-full max-w-3xl space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl">Editar produto</h1>
        <Separator />
        <section className="grid grid-cols-2 gap-8 py-5">
          <div>
            <p>Fotos galeria do app</p>
            <span className="text-sm text-muted-foreground">
              Digite o nome que será mostrado publicamente como identificação do
              seu workspace em todas as interações na plataforma.
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
              Digite o nome que será mostrado publicamente como identificação do
              seu workspace em todas as interações na plataforma.
            </span>
          </div>
          <div className="flex justify-end">
            <Input
              placeholder="Nome..."
              defaultValue={application?.name}
              {...register("name", { required: true })}
              disabled={isSubmitting}
            />
          </div>
        </section>
        <Separator />
        <section className="grid grid-cols-2 gap-8 py-5">
          <div>
            <p>
              Cta da aplicação <span className="text-red-400">*</span>
            </p>
            <span className="text-sm text-muted-foreground">
              Digite o nome que será mostrado publicamente como identificação do
              seu workspace em todas as interações na plataforma.
            </span>
          </div>
          <div className="flex justify-end">
            <Input
              placeholder="Cta..."
              {...register("cta", { required: true })}
              disabled={isSubmitting}
              defaultValue={application?.cta}
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
              Digite o nome que será mostrado publicamente como identificação do
              seu workspace em todas as interações na plataforma.
            </span>
          </div>
          <div className="flex justify-end">
            <Textarea
              placeholder="Descrição da aplicação..."
              className="resize-none"
              {...register("description", { required: true })}
              disabled={isSubmitting}
              defaultValue={application?.description}
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
              Digite o nome que será mostrado publicamente como identificação do
              seu workspace em todas as interações na plataforma.
            </span>
          </div>
          <div className="flex justify-end">
            <Input
              placeholder="Título da descrição..."
              {...register("titleDescription", { required: true })}
              defaultValue={application?.descriptionTitle}
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
              Digite o nome que será mostrado publicamente como identificação do
              seu workspace em todas as interações na plataforma.
            </span>
          </div>
          <div className="flex justify-end">
            <Input
              placeholder="URL para Iframe..."
              {...register("iframeUrl", { required: true })}
              defaultValue={application.applicationUrl}
              disabled={isSubmitting}
            />
          </div>
        </section>
        <Separator />
        <section className="grid grid-cols-2 gap-8 py-5">
          <div>
            <p>Compartilhar com</p>
            <span className="text-sm text-muted-foreground">
              Digite o id do workspace e pressione Enter para adicionar à lista.
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
              {sharedWith?.map((value, index) => (
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
            disabled={isSubmitting || editApplicationMutation.isPending}
          >
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}