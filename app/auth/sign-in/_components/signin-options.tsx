"use client";

import Link from "next/link";
import { useState } from "react";
import { GoogleButton } from "../../_components/google-button";
import { Button } from "@/components/ui/button";
import { SignInWithEmailForm } from "./signin-with-email-form";
import { getProviders, LiteralUnion, signIn } from "next-auth/react";
import config from "@/config";
import { BuiltInProviderType } from "next-auth/providers";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { useSearchParams } from "next/navigation";

interface SignInProps {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    {
      id: string;
      name: string;
      type: string;
      signinUrl: string;
      callbackUrl: string;
    }
  >;
}

export function SignInOptions({ csrfToken }: { csrfToken: string }) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(!!error);

  function handleContinueWithEmail() {
    setIsEmailFormVisible(!isEmailFormVisible);
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center">
      <h1 className="mb-8 text-2xl font-bold text-primary">
        {isEmailFormVisible
          ? "Quais são suas credenciais?"
          : "Entrar na Anuntech"}
      </h1>
      {!isEmailFormVisible ? (
        <>
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
          <section className="mt-4">
            <p className="text-sm text-zinc-500">
              Não possui conta?{" "}
              <Link
                href="/auth/sign-up"
                className="text-primary hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
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
