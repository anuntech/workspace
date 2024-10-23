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
import { ChevronDown } from "lucide-react";
import { UserNav } from "./user-nav";
import { House, Rocket, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "./nav-link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";
import { TeamSwitcher } from "@/components/team-switcher";

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
      <SidebarContent>
        <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href={`/?workspace=${workspace}`}>
                <House />
                <span>Home</span>
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
                  <a href={`/service/${data._id}?workspace=${workspace}`}>
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
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  );
}
