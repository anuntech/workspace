"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function GoogleButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const res = await signIn("google");
    if (res.ok) {
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <Button
      className={cn(
        buttonVariants({ variant: "default" }),
        "w-full gap-2 py-6 cursor-pointer"
      )}
      onClick={() => handleGoogleSignIn()}
      disabled={isLoading}
    >
      <Image
        src="/google-logo.svg"
        alt="Logotipo do Google"
        width={16}
        height={16}
      />
      Continuar com Google
    </Button>
  );
}
