"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "./workspace-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LifeBuoy, Sparkles } from "lucide-react";
import { House, Rocket, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "./nav-link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";
import { TeamSwitcher } from "@/app/(workspace)/_components/sidebar/team-switcher";
import { NavUser } from "@/app/(workspace)/_components/sidebar/nav-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");
  const router = useRouter();

  const roleQuery = useQuery({
    queryKey: ["workspace/role"],
    queryFn: () =>
      fetch(`/api/workspace/role/${workspace}`).then(async (res) => ({
        data: await res.json(),
        status: res.status,
      })),
  });

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => api.get(`/api/applications/${workspace}`),
  });

  const data = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => api.get("/api/workspace"),
  });

  if (roleQuery.isPending || applicationsQuery.isPending || data.isPending) {
    return (
      <div className="space-y-2 mx-3 h-full flex flex-col">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <div className="flex-grow mt-auto flex flex-col justify-end gap-2">
          <Skeleton className="h-10" />
          <Separator />
          <Skeleton className="h-10" />
        </div>
      </div>
    );
  }

  if (!workspace) {
    router.push(`/?workspace=${data.data.data[0].id}`);
    return;
  }

  let enabledApplications;

  if (applicationsQuery?.data?.data && applicationsQuery.data.status === 200) {
    enabledApplications = applicationsQuery.data.data?.filter(
      (app: any) => app.status === "enabled"
    );
  }

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="rounded-r-md w-100px"
    >
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="pl-2">
        <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href={`/?workspace=${workspace}`}>
                <House />
                <span>Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarGroupContent>
            {roleQuery.data?.data?.role !== "member" &&
              !roleQuery.isPending && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href={`/settings?workspace=${workspace}`}>
                      <Settings />
                      <span>Configurações</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
          </SidebarGroupContent>
        </SidebarMenu>
        {enabledApplications.length > 0 && (
          <SidebarGroupLabel>Aplicativos</SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {enabledApplications?.map((data: any) => (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
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
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href={`/?workspace=${workspace}`} className="text-[0.8rem]">
                <Sparkles className="text-[0.8rem]" />
                Upgrade
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href={`/?workspace=${workspace}`} className="text-[0.8rem]">
                <LifeBuoy className="text-[0.8rem]" />
                Suporte
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
