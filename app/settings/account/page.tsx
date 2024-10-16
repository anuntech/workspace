"use client";

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
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

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

  return (
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
                Seu e-mail é usado para entrar na sua conta e para nós enviarmos
                comunicações importantes.
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
              <Button type="button" variant="destructive">
                Deletar conta
              </Button>
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
  );
}
