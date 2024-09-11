import Link from "next/link";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { redirect, useSearchParams } from "next/navigation";

export function SignInWithEmailForm({ csrfToken }: { csrfToken: string }) {
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await signIn("email", { email });
  };

  return (
    <form
      method="post"
      action="/api/auth/signin/email"
      className="w-full transform space-y-4"
    >
      {error && <p className="text-red-500">Email inválido</p>}
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
      <Button onClick={handleSubmit} type="submit" className="w-full py-6">
        Continuar com e-mail
      </Button>
    </form>
  );
}
