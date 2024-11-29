"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

const emailSchema = z.object({
  email: z
    .string()
    .min(
      1,
      "O campo de e-mail não pode estar vazio. Por favor, preencha-o antes de continuar."
    )
    .email(
      "Por favor, insira um endereço de e-mail válido no formato: exemplo@dominio.com."
    )
    .max(
      254,
      "O endereço de e-mail excede o limite de 254 caracteres. Insira um e-mail mais curto."
    ),
});

export function SignInWithEmailForm({ csrfToken }: { csrfToken: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
  });

  async function onSubmit(data: any) {
    setIsSubmitting(true);
    try {
      await signIn("email", { email: data.email });
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <div>
        <Input
          type="text"
          placeholder="exemplo@company.com"
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message.toString()}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full flex items-center justify-center"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Continuar com o e-mail
      </Button>
    </form>
  );
}
