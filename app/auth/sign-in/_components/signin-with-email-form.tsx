import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export function SignInWithEmailForm({ csrfToken }: { csrfToken: string }) {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const [email, setEmail] = useState(emailParam || "");
  const emailError = searchParams.get("error") == "EmailSignin";

  const signInWithEmailMutation = useMutation({
    mutationFn: () =>
      signIn("email", { email, callbackUrl: "/onboarding/name" }),
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    signInWithEmailMutation.mutate();
  };

  return (
    <form
      method="post"
      action="/api/auth/signin/email"
      className="w-full transform space-y-4"
    >
      {emailError && <p className="text-red-500">Email inválido</p>}
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <Input
        type="email"
        name="email"
        placeholder="E-mail"
        className="py-6"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />
      <Button
        onClick={handleSubmit}
        disabled={signInWithEmailMutation.isPending}
        type="submit"
        className="w-full py-6"
      >
        Continuar com e-mail
      </Button>
    </form>
  );
}
