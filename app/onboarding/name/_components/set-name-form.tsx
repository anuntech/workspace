"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SetNameForm() {
  const [name, setName] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const req = async () => {
      const res = await fetch("/api/user");
      const userJson = await res.json();

      if (userJson.name) {
        router.push("/");
      }

      setName(userJson.name);
    };

    req();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <form className="w-full space-y-4">
      <Input
        type="text"
        name="name"
        defaultValue={name}
        placeholder="Nome"
        className="py-6"
        autoFocus
      />
      <Button type="submit" className="w-full py-6">
        Continuar
      </Button>
    </form>
  );
}
