"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function SetNameForm() {
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const router = useRouter();

  const createFirstWorkspace = async (name: string) => {
    const getRes = await fetch("/api/workspace");
    const isThereAnyWorkspace = await getRes.json();
    if (isThereAnyWorkspace.length > 0) {
      return;
    }

    const res = await fetch("/api/workspace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name + "'s Workspace",
        icon: "apple",
      }),
    });

    if (res.ok) {
      router.push("");
    }
  };

  useEffect(() => {
    const req = async () => {
      const res = await fetch("/api/user");
      const userJson = await res.json();
      if (userJson.name) {
        createFirstWorkspace(userJson.name);
        router.push("/");
      }

      setName(userJson.name);
    };

    req();
  }, []);

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
      await createFirstWorkspace(nameInput);
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
        defaultValue={name}
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
