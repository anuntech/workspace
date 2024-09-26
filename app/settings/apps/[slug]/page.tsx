"use client";

import Link from "next/link";
import { ChevronLeft, CirclePlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function AppPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();

  const workspace = searchParams.get("workspace");

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res = await fetch(`/api/applications/${workspace}`);
      return res.json();
    },
  });

  const getApplicationMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/applications/${workspace}/allow`, {
        body: JSON.stringify({
          applicationId: params.slug,
        }),
        method: "POST",
      });
      return res.json();
    },
    onSuccess: () => {
      applicationsQuery.refetch();
    },
  });

  const application = applicationsQuery?.data?.find(
    (app: any) => app._id === params.slug
  );
  const alreadyEnabled = application.status === "enabled";

  return (
    <div className="flex flex-col items-center p-10">
      <div className="w-full max-w-3xl space-y-5">
        <Link
          href={`/settings/apps?workspace=${workspace}`}
          className="flex w-max items-center gap-2 text-sm"
        >
          <ChevronLeft className="size-4" />
          Loja de aplicativos
        </Link>
        <section className="flex gap-3">
          <Avatar className="size-14">
            <AvatarImage src={application.avatarSrc || "/shad.png"} />
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>{application.name}</span>
            <span className="text-sm text-muted-foreground">
              {application.cta}
            </span>
          </div>
        </section>
        <section className="space-y-5 rounded-md border p-5">
          <header className="flex justify-between">
            <div></div>
            <Button
              type="button"
              onClick={() => getApplicationMutation.mutate()}
              disabled={applicationsQuery.isPending || alreadyEnabled}
            >
              <CirclePlus className="mr-2 size-5" />
              Habilitar
            </Button>
          </header>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-52 rounded-md bg-zinc-300" />
            <div className="h-52 rounded-md bg-zinc-300" />
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <span>Visão geral</span>
              <p className="text-muted-foreground">{application.description}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
