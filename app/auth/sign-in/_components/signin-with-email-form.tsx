import Link from "next/link";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function SignInWithEmailForm({ csrfToken }: { csrfToken: string }) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    signIn("email", { email });
  };

  return (
    <form
      method="post"
      action="/api/auth/signin/email"
      className="w-full transform space-y-4"
    >
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
      {/* <div className="space-y-1.5">
        <PasswordInput placeholder="Senha" name="password" />
        <Link
          href="/auth/forgot"
          className="block text-end text-xs text-primary hover:underline"
        >
          Esqueceu a senha?
        </Link>
      </div> */}
      <Button onClick={handleSubmit} type="submit" className="w-full py-6">
        Continuar com e-mail
      </Button>
    </form>
  );
}
