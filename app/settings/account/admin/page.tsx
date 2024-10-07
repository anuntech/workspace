"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Input = {
  name: string;
  cta: string;
  title: string;
  file: string;
  iframeUrl: string;
  description: string;
  titleDescription: string;
  profilePhoto: string;
  galeryPhotos: string;
};

export default function AdminPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Input>();
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");

  const onSubmit: SubmitHandler<Input> = async (data) => {};

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col  p-10 space-y-5"
    >
      <h1 className="text-2xl">Adicionar produto</h1>

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
            className="cursor-pointer"
            placeholder="Nome..."
            type="file"
            {...register("profilePhoto")}
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
        <Button type="submit" disabled={isSubmitting}>
          Publicar
        </Button>
      </div>
    </form>
  );
}
