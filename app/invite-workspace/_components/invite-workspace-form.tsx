"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function InviteWorkspaceForm() {
  const searchParams = useSearchParams();
  const invite = searchParams.get("token");

  const {
    data: response,
    isFetched,
    isPending,
  } = useQuery({
    queryKey: ["workspace/get-invite-data"],
    queryFn: async () => {
      const res = await fetch(`/api/workspace/get-invite-data/${invite}`);
      return {
        data: await res.json(),
        status: res.status,
      };
    },
  });

  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  if (user.isFetched && !user) {
    signIn("email", {
      email: response.data.email,
      callbackUrl: `/invite-workspace?token=${invite}`,
    });
  }

  if (
    user.isFetched &&
    isFetched &&
    user?.data?.email != response?.data?.email
  ) {
    signIn("email", {
      email: response.data.email,
      callbackUrl: `/invite-workspace?token=${invite}`,
    });
  }

  const router = useRouter();
  if (isFetched && response.status == 400) {
    router.push("/");
  }

  const acceptInviteMutation = useMutation({
    mutationFn: (data: { invite: string }) =>
      fetch("/api/workspace/invite/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      if (data.status == 200) {
        router.push(`/?workspace=${response?.data?.workspaceId}`);
      }
    },
  });

  return (
    <>
      <Button
        type="button"
        className="w-full py-6"
        disabled={acceptInviteMutation.isPending || isPending}
        onClick={() => acceptInviteMutation.mutate({ invite })}
      >
        Aceitar
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full py-6"
        onClick={() => router.push("/")}
      >
        Recusar
      </Button>
    </>
  );
}
