"use client";

import Link from "next/link";
import { useState } from "react";
import { GoogleButton } from "../../_components/google-button";
import { Button } from "@/components/ui/button";
import { SignInWithEmailForm } from "./signin-with-email-form";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export function SignInOptions({ csrfToken }: { csrfToken: string }) {
  const searchParams = useSearchParams();
  const emailError = searchParams.get("error") == "EmailSignin";
  const googleError = searchParams.get("error") == "OAuthSignin";
  const accountNotLinked = searchParams.get("error") == "OAuthAccountNotLinked";
  const isRegister = searchParams.get("register") == "true";
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(!!emailError);

  function handleContinueWithEmail() {
    setIsEmailFormVisible(!isEmailFormVisible);
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center">
      <h1 className="mb-8 text-2xl font-bold text-primary">
        {isEmailFormVisible
          ? "Quais são suas credenciais?"
          : `${isRegister ? "Registrar" : "Entrar"} na Anuntech`}
      </h1>
      {!isEmailFormVisible ? (
        <>
          {googleError && (
            <p className="text-red-500 py-4">
              Ocorreu algum erro ao entrar com o Google
            </p>
          )}
          {accountNotLinked && (
            <p className="text-red-500 py-4">Conta não vinculada ao Google</p>
          )}
          <div className="w-full space-y-4">
            <GoogleButton />
            <Button
              type="button"
              variant="outline"
              className="w-full py-6"
              onClick={() => setIsEmailFormVisible(!isEmailFormVisible)}
            >
              Continuar com e-mail
            </Button>
          </div>
          <section className="flex justify-center flex-col items-center mt-4 space-y-4 py-4">
            {isRegister && (
              <>
                <p className="text-center text-sm text-zinc-500">
                  Ao se registrar, você concorda com os{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    termos de uso
                  </Link>{" "}
                  da plataforma e{" "}
                  <Link href="/dpa" className="text-primary hover:underline">
                    políticas de privacidade
                  </Link>{" "}
                  da Anuntech.
                </p>
                <Separator className="mx-auto w-1/4" />
                <p className="text-sm text-zinc-500">
                  Já possui conta?{" "}
                  <Link
                    href="/auth/sign-in"
                    className="text-primary hover:underline"
                  >
                    Entrar
                  </Link>
                </p>
              </>
            )}
            {!isRegister && (
              <>
                {/* <p className="text-sm text-zinc-500">
                  Não possui conta?{" "}
                  <Link
                    href="/auth/sign-in?register=true"
                    className="text-primary hover:underline"
                  >
                    Cadastre-se
                  </Link>
                </p> */}
              </>
            )}
          </section>
        </>
      ) : (
        <>
          <SignInWithEmailForm csrfToken={csrfToken} />
          <Button
            variant="link"
            className="mt-4"
            onClick={handleContinueWithEmail}
          >
            Voltar ao login
          </Button>
        </>
      )}
    </div>
  );
}
