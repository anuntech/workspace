"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";

type Inputs = {
  name: string;
};

export function SetNameForm() {
  const { isPending, data, isSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<Inputs>();

  useEffect(() => {
    if (!isSuccess) return;

    setValue("name", data.name);
  }, [data]);

  const router = useRouter();

  const createFirstWorkspace = async (name: string) => {
    const getRes = await fetch(`/api/workspace`);
    const isThereAnyWorkspace = await getRes.json();
    if (isThereAnyWorkspace.length > 0) {
      return;
    }

    await fetch(`/api/workspace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name + "'s Workspace",
        icon: "apple",
      }),
    });
  };

  const onSubmit: SubmitHandler<Inputs> = async ({ name }) => {
    if (!name) {
      return;
    }

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    });

    if (res.ok) {
      await createFirstWorkspace(name);
      router.push("/");
      return;
    }

    return;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <Input
        type="text"
        name="name"
        defaultValue={data?.name}
        placeholder="Nome"
        className="py-6"
        autoFocus
        disabled={isPending || isSubmitting}
        {...register("name", { required: true })}
      />
      <Button
        disabled={isPending || isSubmitting}
        type="submit"
        className="w-full py-6"
      >
        Continuar
      </Button>
    </form>
  );
}
