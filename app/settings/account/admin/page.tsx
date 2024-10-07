"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SubmitHandler, useForm } from "react-hook-form";

type Input = {
  name: string;
  cta: string;
  title: string;
  file: string;
};

export default function AdminPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<Input>();

  const onSubmit: SubmitHandler<Input> = async (data) => {};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col  p-10 space-y-5"
    >
      <h1 className="text-2xl">Geral</h1>

      <section className="grid grid-cols-2 gap-8 py-5">
        <div>
          <p>Foto de perfil do app</p>
          <span className="text-sm text-muted-foreground">
            Digite o nome que será mostrado publicamente como identificação do
            seu workspace em todas as interações na plataforma.
          </span>
        </div>
        <div className="flex justify-end">
          <Input
            placeholder="Nome..."
            type="file"
            {...register("file", { required: true })}
            disabled={isSubmitting}
          />
        </div>
      </section>
      <Separator />
      <section className="grid grid-cols-2 gap-8 py-5">
        <div>
          <p>Fotos galeria do app</p>
          <span className="text-sm text-muted-foreground">
            Digite o nome que será mostrado publicamente como identificação do
            seu workspace em todas as interações na plataforma.
          </span>
        </div>
        <div className="flex justify-end">
          <Input
            placeholder="Nome..."
            type="file"
            multiple
            {...register("file", { required: true })}
            disabled={isSubmitting}
          />
        </div>
      </section>
      <Separator />
      <section className="grid grid-cols-2 gap-8 py-5">
        <div>
          <p>Nome da aplicação</p>
          <span className="text-sm text-muted-foreground">
            Digite o nome que será mostrado publicamente como identificação do
            seu workspace em todas as interações na plataforma.
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
          <p>Cta da aplicação</p>
          <span className="text-sm text-muted-foreground">
            Digite o nome que será mostrado publicamente como identificação do
            seu workspace em todas as interações na plataforma.
          </span>
        </div>
        <div className="flex justify-end">
          <Input
            placeholder="Cta..."
            {...register("name", { required: true })}
            disabled={isSubmitting}
          />
        </div>
      </section>
      <Separator />
      <section className="grid grid-cols-2 gap-8 py-5">
        <div>
          <p>Título da descrição</p>
          <span className="text-sm text-muted-foreground">
            Digite o nome que será mostrado publicamente como identificação do
            seu workspace em todas as interações na plataforma.
          </span>
        </div>
        <div className="flex justify-end">
          <Input
            placeholder="Cta..."
            {...register("name", { required: true })}
            disabled={isSubmitting}
          />
        </div>
      </section>
      <Separator />
      <section className="grid grid-cols-2 gap-8 py-5">
        <div>
          <p>Título da descrição</p>
          <span className="text-sm text-muted-foreground">
            Digite o nome que será mostrado publicamente como identificação do
            seu workspace em todas as interações na plataforma.
          </span>
        </div>
        <div className="flex justify-end">
          <Textarea
            placeholder="Cta..."
            className="resize-none"
            {...register("name", { required: true })}
            disabled={isSubmitting}
          />
        </div>
      </section>
      <Separator />
      <section className="grid grid-cols-2 gap-8 py-5">
        <div>
          <p>URL para Iframe</p>
          <span className="text-sm text-muted-foreground">
            Digite o nome que será mostrado publicamente como identificação do
            seu workspace em todas as interações na plataforma.
          </span>
        </div>
        <div className="flex justify-end">
          <Input
            placeholder="Cta..."
            {...register("name", { required: true })}
            disabled={isSubmitting}
          />
        </div>
      </section>
      <Separator />
      <section className="grid grid-cols-2 gap-8 py-5">
        <div>
          <p>Compartilhar com</p>
          <span className="text-sm text-muted-foreground">
            Digite o nome que será mostrado publicamente como identificação do
            seu workspace em todas as interações na plataforma.
          </span>
        </div>
        <div className="flex justify-end">
          <Input
            placeholder="Cta..."
            {...register("name", { required: true })}
            disabled={isSubmitting}
          />
        </div>
      </section>

      <div className="flex justify-end max-w-3xl items-center mt-20 w-full">
        <Button type="submit" disabled={isSubmitting}>
          Publicar
        </Button>
      </div>
    </form>
  );
}
