"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function SetNameForm() {
  const [nameInput, setNameInput] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!nameInput) {
      return;
    }

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: nameInput }),
    });

    if (res.ok) {
      router.push("/");
      return;
    }

    return;
  };

  return (
    <form className="w-full space-y-4">
      <Input
        type="text"
        name="name"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        placeholder="Nome"
        className="py-6"
        autoFocus
      />
      <Button onClick={handleSubmit} type="submit" className="w-full py-6">
        Continuar
      </Button>
    </form>
  );
}
