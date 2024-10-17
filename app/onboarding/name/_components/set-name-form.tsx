"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import api from "@/libs/api";

type Inputs = {
  name: string;
};

export function SetNameForm() {
  const router = useRouter();

  const { isPending, data, isSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  const workspaces = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => api.get("/api/workspace"),
  });
  if (workspaces?.data?.data.length > 0) {
    router.push("/");
  }

  const saveNameMutation = useMutation({
    mutationFn: ({ name }: Inputs) =>
      fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }),
    onSuccess: (data) => {
      if (data.ok) {
        getTokenMutation.mutate();
        return;
      }
    },
  });

  const getTokenMutation = useMutation({
    mutationFn: async () => fetch("/api/user/get-invitations-link"),
    onSuccess: async (data) => {
      if (data.ok) {
        router.push(`/invite-workspace?token=${(await data.json()).token}`);
        return;
      }

      router.push("/create-workspace");
    },
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

  const onSubmit: SubmitHandler<Inputs> = async ({ name }) => {
    if (!name) {
      return;
    }

    saveNameMutation.mutate({ name });
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
