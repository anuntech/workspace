"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "../../../../components/ui/skeleton";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { getS3Image } from "@/libs/s3-client";

export function NavProjects() {
  const { isMobile } = useSidebar();
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");
  const router = useRouter();

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => api.get(`/api/applications/${workspace}`),
  });

  if (applicationsQuery.isPending) {
    return <Skeleton className="h-7 mx-2" />;
  }

  let enabledApplications;

  if (applicationsQuery?.data?.data && applicationsQuery.data.status === 200) {
    enabledApplications = applicationsQuery.data.data?.filter(
      (app: any) => app.status === "enabled"
    );
  }

  console.log(enabledApplications);

  return (
    // <SidebarGroup className="group-data-[collapsible=icon]:hidden">
    <SidebarGroup>
      {enabledApplications.length > 0 && (
        <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
          Aplicativos
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {enabledApplications.map((data: any) =>
          data.fields.length == 0 ? (
            <SidebarMenuItem key={data.name}>
              <SidebarMenuButton
                asChild
                className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                tooltip={data.name}
              >
                <Link
                  href={`/service/${data._id}?workspace=${workspace}`}
                  passHref
                >
                  {data.icon?.type == "emoji" && (
                    <p className="size-5">{data.icon.value}</p>
                  )}
                  {(data.icon?.type == "image" || !data.icon) && (
                    <Avatar className="size-5">
                      <AvatarImage
                        src={getS3Image(data.icon?.value || data.avatarSrc)}
                      />
                      <AvatarFallback>{data.avatarFallback}</AvatarFallback>
                    </Avatar>
                  )}
                  <span>{data.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem key={data.name}>
              <SidebarMenuButton
                asChild
                className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                tooltip={data.name}
              >
                <Link
                  href={`/service/${data._id}?workspace=${workspace}`}
                  passHref
                >
                  {data.icon?.type == "emoji" && (
                    <p className="size-5">{data.icon.value}</p>
                  )}
                  {(data.icon?.type == "image" || !data.icon) && (
                    <Avatar className="size-5">
                      <AvatarImage
                        src={getS3Image(data.icon?.value || data.avatarSrc)}
                      />
                      <AvatarFallback>{data.avatarFallback}</AvatarFallback>
                    </Avatar>
                  )}
                  <span>{data.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
