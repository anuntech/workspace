"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsPage() {
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => api.get("/api/user/notifications"),
  });

  const notifications = notificationsQuery.data?.data || [];

  const acceptInviteMutation = useMutation({
    mutationFn: async (data: { notificationId: string; workspaceId: string }) =>
      api.post("/api/workspace/invite/accept-without-token", {
        notificationId: data.notificationId,
        workspaceId: data.workspaceId,
      }),
    onSuccess: () => {
      notificationsQuery.refetch();
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Erro ao aceitar o convite",
        description: (err.response.data as any)?.error,
        variant: "destructive",
        duration: 7000,
      });
    },
  });

  const refuseInviteMutation = useMutation({
    mutationFn: async (data: {
      notificationId: string;
      workspaceId: string;
    }) => {
      await api.post("/api/workspace/invite/refuse", {
        notificationId: data.notificationId,
        workspaceId: data.workspaceId,
      });
    },
    onSuccess: () => {
      notificationsQuery.refetch();
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      await api.post("/api/user/notifications/mark-as-read");
    },
  });

  useEffect(() => {
    markAsReadMutation.mutate();
  }, []);

  return (
    <>
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 px-4 shadow-sm">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Minha conta</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Notificações</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-semibold">Suas notificações</h1>
        </div>

        <div className="mt-4 flex gap-4">
          <Button variant="outline" size="sm">
            Todas
          </Button>
          <Button variant="outline" size="sm">
            Mensagens
          </Button>
          <Button variant="outline" size="sm">
            Convites
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {!notificationsQuery.isPending ? (
            notifications.map((notification: any) => (
              <div
                key={notification.id}
                className={`flex items-start p-4 rounded-lg shadow-sm ${
                  notification.isNew
                    ? "bg-gray-50 border-l-4 border-blue-500"
                    : "bg-white"
                }`}
              >
                <div className="mr-4">
                  {notification?.icon?.value ? (
                    <div className="text-[1.3rem]">
                      {notification.icon.type === "emoji" ? (
                        notification.icon.value
                      ) : (
                        <Avatar className="size-10">
                          <AvatarImage
                            src={
                              getS3Image(notification.icon.value) || "/shad.png"
                            }
                            alt="@shadcn"
                          />
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ) : (
                    <Avatar className="size-10">
                      <AvatarImage
                        src={notification?.avatar || "/shad.png"}
                        alt="@shadcn"
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="ml-2 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{notification.user}</span>{" "}
                    {notification.message}
                  </p>
                  {notification.comment && (
                    <p className="mt-1 text-sm text-gray-600 border-l-2 border-gray-200 pl-2">
                      {notification.comment}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {notification.time}
                  </p>
                </div>

                {notification.isInvite && notification.state === "neutral" && (
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      onClick={() =>
                        refuseInviteMutation.mutate({
                          notificationId: notification.id,
                          workspaceId: notification.workspaceId,
                        })
                      }
                      variant="outline"
                      size="sm"
                      disabled={
                        acceptInviteMutation.isPending ||
                        refuseInviteMutation.isPending
                      }
                    >
                      <XIcon className="w-4 h-4 mr-1" />
                      Recusar
                    </Button>
                    <Button
                      onClick={() =>
                        acceptInviteMutation.mutate({
                          notificationId: notification.id,
                          workspaceId: notification.workspaceId,
                        })
                      }
                      disabled={
                        acceptInviteMutation.isPending ||
                        refuseInviteMutation.isPending
                      }
                      variant="default"
                      size="sm"
                    >
                      <CheckIcon className="w-4 h-4 mr-1" />
                      Aceitar
                    </Button>
                  </div>
                )}

                {notification.isInvite && notification.state === "accepted" && (
                  <div className="flex items-center space-x-2 px-3 py-1 ml-4 rounded-lg bg-green-100 text-green-600 text-xs">
                    <CheckIcon className="h-4 w-4" />
                    <span>Convite aceito</span>
                  </div>
                )}

                {notification.isInvite && notification.state === "refused" && (
                  <div className="flex items-center space-x-2 px-3 py-1 ml-4 rounded-lg bg-red-100 text-red-600 text-xs">
                    <XIcon className="h-4 w-4" />
                    <span>Convite recusado</span>
                  </div>
                )}

                {notification.isNew && (
                  <div className="ml-4 mt-2">
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full"
                      title="Notificação nova"
                    ></div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <>
              <Skeleton className="w-full h-14 mb-5 p-4 rounded-lg" />
              <Skeleton className="w-full h-14 mb-5 p-4 rounded-lg" />
              <Skeleton className="w-full h-14 mb-5 p-4 rounded-lg" />
              <Skeleton className="w-full h-14 mb-5 p-4 rounded-lg" />
              <Skeleton className="w-full h-14 mb-5 p-4 rounded-lg" />
              <Skeleton className="w-full h-14 mb-5 p-4 rounded-lg" />
            </>
          )}
        </div>
      </div>
    </>
  );
}
