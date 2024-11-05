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
import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const notifications = [
  {
    id: 1,
    user: "@frankiesullivan",
    message: "followed you",
    time: "2 hours ago",
    avatar: "/path/to/avatar1.png", // replace with the actual path to the avatar image
    isNew: true,
  },
];

export default function NotificationsPage() {
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => api.get("/api/user/notifications"),
  });

  const notifications = notificationsQuery.data?.data || [];

  return (
    <>
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 px-4">
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Your notifications</h1>
          <Button variant="link" className="text-blue-600 font-medium">
            Mark all as read
          </Button>
        </div>

        <div className="mt-4 flex gap-4">
          <Button variant="outline" size="sm">
            View all
          </Button>
          <Button variant="outline" size="sm">
            Messages
          </Button>
          <Button variant="outline" size="sm">
            Invites
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {notifications.map((notification: any) => (
            <div
              key={notification.id}
              className={`flex items-start p-4 rounded-lg ${
                notification.isNew ? "bg-gray-100" : "bg-white"
              }`}
            >
              {Object.entries(notification?.icon).length > 0 && (
                <div className="text-[1.3rem]">
                  {notification.icon.type == "emoji" ? (
                    notification.icon.value
                  ) : (
                    <Image
                      className="rounded-full"
                      width={54}
                      height={54}
                      src={getS3Image(notification.icon.value)}
                      alt=""
                    />
                  )}
                </div>
              )}
              {Object.entries(notification?.icon).length == 0 && (
                <Avatar className="size-10">
                  <AvatarImage
                    src={notification?.avatar || "/shad.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              )}
              <div className="ml-4 flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{notification.user}</span>{" "}
                  {notification.message}
                </p>
                {notification.comment && (
                  <p className="mt-2 text-sm text-gray-600 border-l-2 border-gray-300 pl-2">
                    {notification.comment}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {notification.time}
                </p>
              </div>
              {notification.isInvite ? (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Decline
                  </Button>
                  <Button variant="default" size="sm">
                    Accept
                  </Button>
                </div>
              ) : (
                <div className="mt-2">
                  {notification.isNew && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
