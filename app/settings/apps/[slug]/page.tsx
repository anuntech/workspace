"use client";

import Link from "next/link";
import { ChevronLeft, CircleMinus, CirclePlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";
import AppGalleryCarousel from "./_components/carousel";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

export default function AppPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();

  const workspace = searchParams.get("workspace");

  const workspaceQuery = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => await api.get(`/api/workspace`),
  });

  const actualWorkspace = workspaceQuery.data?.data?.find(
    (v: any) => v.id === workspace
  );

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => await api.get(`/api/applications/${workspace}`),
  });

  const queryClient = useQueryClient();

  const getApplicationMutation = useMutation({
    mutationFn: async () =>
      await api.post(`/api/applications/${workspace}/allow`, {
        applicationId: params.slug,
      }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["applications"],
        type: "all",
      });
    },
    onError: (err: AxiosError) => {
      toast({
        description: (err.response.data as any).error,
        duration: 5000,
        variant: "destructive",
      });
    },
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/applications/${workspace}/allow`, {
        body: JSON.stringify({
          applicationId: params.slug,
        }),
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: () => {
      applicationsQuery.refetch();
    },
  });

  if (applicationsQuery.isPending || applicationsQuery.isLoading) {
    return <div>Carregando...</div>;
  }

  const application = applicationsQuery?.data?.data.find(
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
          {application.icon?.type == "emoji" && (
            <p className="text-[2rem]">{application.icon.value}</p>
          )}
          {(application.icon?.type == "image" || !application.icon) && (
            <Avatar>
              <AvatarImage
                src={getS3Image(
                  application.icon?.value || application.avatarSrc
                )}
              />
              <AvatarFallback>{application.avatarFallback}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col">
            <span>{application.name}</span>
            <span className="text-sm text-muted-foreground">
              {application.cta}
            </span>
          </div>
        </section>
        <section className="space-y-5 rounded-md border p-5">
          <header className="flex justify-end">
            {application.workspaceAccess == "premium" &&
            actualWorkspace.plan != "premium" ? (
              // A button to user to upgrade to premium
              <Link href={`/settings/plans?workspace=${workspace}`}>
                <Button
                  type="button"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  <CirclePlus className="mr-2 size-5" />
                  Upgrade para Premium
                </Button>
              </Link>
            ) : alreadyEnabled ? (
              <Button
                type="button"
                onClick={() => deleteApplicationMutation.mutate()}
                variant="destructive"
                disabled={deleteApplicationMutation.isPending}
              >
                <CircleMinus className="mr-2 size-5" onClick={() => {}} />
                Desinstalar
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => getApplicationMutation.mutate()}
                disabled={getApplicationMutation.isPending}
              >
                <CirclePlus className="mr-2 size-5" />
                Instalar
              </Button>
            )}
          </header>
          {application.galleryPhotos.length == 0 ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="h-52 rounded-md bg-zinc-300" />
              <div className="h-52 rounded-md bg-zinc-300" />
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <AppGalleryCarousel application={application} />
            </div>
          )}
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
