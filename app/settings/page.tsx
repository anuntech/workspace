"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Workspace = {
  name?: string;
  id?: string;
  icon?: any;
};

export default function SettingsPage() {
  const { isPending, data, isSuccess } = useQuery<Workspace[]>({
    queryKey: ["workspace"],
    queryFn: () => fetch("/api/workspace").then((res) => res.json()),
  });

  const searchParams = useSearchParams();

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (!isSuccess) return;
    const workspace = data?.find(
      (workspace) => workspace.id === searchParams.get("workspace")
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
              <Carousel className="w-full max-w-52" opts={{ loop: true }}>
                <CarouselContent>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                      <div className="flex aspect-square items-center justify-center rounded-md border p-6">
                        <span className="text-4xl font-semibold">
                          {index + 1}
                        </span>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
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
                  <Button variant="destructive">Deletar workspace</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Entre em contato com o suporte
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Para prosseguir com a exclusão do workspace, entre em
                      contato com nosso suporte. Eles irão ajudar você a
                      concluir essa ação de forma segura.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Ok</AlertDialogCancel>
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
