"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Search } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";
import { Input } from "./ui/input";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const urlParams = useSearchParams();
  const router = useRouter();

  const [filter, setFilter] = useState("");

  const { data, isSuccess } = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => api.get("/api/workspace"),
  });
  const selectedWorkspace = urlParams.get("workspace");

  useEffect(() => {
    if (!isSuccess) return;

    const urlWorkspace = urlParams.get("workspace");

    if (!urlWorkspace && data.data.length > 0) {
      const firstWorkspaceId = data.data[0]?.id;
      router.push(`/?workspace=${firstWorkspaceId}`);
      return;
    }
  }, [data]);

  const actualWorkspace = data.data.find(
    (v: any) => v.id === selectedWorkspace
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {actualWorkspace?.icon.type == "emoji" ? (
                <p className="text-[25px]">{actualWorkspace?.icon.value}</p>
              ) : (
                <div className="flex aspect-square size-7 items-center justify-center rounded-lg">
                  <img
                    className="rounded-lg"
                    src={getS3Image(actualWorkspace?.icon.value)}
                    alt="@shadcn"
                  />
                </div>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {actualWorkspace.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
            defaultValue={selectedWorkspace}
          >
            <div className="flex items-center">
              <Search className="h-4" />
              <Input
                className="h-7 border-none focus-visible:ring-0 focus-visible:outline-none"
                placeholder="Procurar workspace..."
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {data?.data
              .filter((team: any) =>
                team.name.toLowerCase().includes(filter.toLowerCase())
              )
              .map((team: any, index: number) => (
                <DropdownMenuItem key={index} className="gap-2 p-2">
                  <a
                    href={`/?workspace=${team.id}`}
                    className="flex items-center gap-3"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      {team.icon.type == "emoji" ? (
                        team.icon.value
                      ) : (
                        <div className="w-5 h-5 flex items-center justify-center">
                          <img
                            className="rounded-sm"
                            src={getS3Image(team.icon.value)}
                            alt="@shadcn"
                          />
                        </div>
                      )}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate">{team.name}</span>
                    </div>
                  </a>
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/create-workspace")}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Criar workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
