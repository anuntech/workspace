"use client";

import { ChevronRight, House, Settings, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../../../../components/ui/skeleton";
import Link from "next/link";

export function NavMain() {
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");

  const roleQuery = useQuery({
    queryKey: ["workspace/role"],
    queryFn: () =>
      fetch(`/api/workspace/role/${workspace}`).then(async (res) => ({
        data: await res.json(),
        status: res.status,
      })),
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild className="group/collapsible">
          <SidebarMenuItem>
            <SidebarMenuButton
              className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
              asChild
              tooltip={"Dashboard"}
            >
              <a href={`/?workspace=${workspace}`}>
                <House />
                <span>Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Collapsible>
        {roleQuery.isPending ? (
          <Skeleton className="h-7" />
        ) : (
          roleQuery.data?.data?.role !== "member" &&
          !roleQuery.isPending && (
            <Collapsible asChild className="group/collapsible">
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                  asChild
                  tooltip={"Configurações"}
                >
                  <a
                    href={`/settings?workspace=${workspace}`}
                    className="w-full"
                  >
                    <Settings />
                    <span>Configurações</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Collapsible>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
