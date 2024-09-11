import { getCsrfToken, LiteralUnion } from "next-auth/react";
import { SignInOptions } from "./_components/signin-options";
import { BuiltInProviderType } from "next-auth/providers";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";

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

export default async function SignInPage({}) {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/");
  }

  const csrfToken = await getCsrfToken();

  return <SignInOptions csrfToken={csrfToken} />;
}
