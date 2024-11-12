"use client";

import { LifeBuoy, Sparkles } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import { Collapsible } from "@/components/ui/collapsible";
import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api";
import { Skeleton } from "@/components/ui/skeleton";

export function NavFooterOptions() {
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");

  const workspaceQuery = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => api.get("/api/workspace"),
  });

  const actualWorkspace = workspaceQuery.data?.data?.find(
    (works: any) => works.id === workspace
  );

  const roleQuery = useQuery({
    queryKey: ["workspace/role"],
    queryFn: () =>
      fetch(`/api/workspace/role/${workspace}`).then(async (res) => ({
        data: await res.json(),
        status: res.status,
      })),
  });

  return (
    <SidebarMenu>
      {roleQuery.isPending ? (
        <Skeleton className="h-7" />
      ) : (
        actualWorkspace?.plan == "free" &&
        roleQuery.data?.data?.role !== "member" && (
          <Collapsible asChild className="group/collapsible">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                tooltip={"Upgrade"}
              >
                <a
                  href={`/settings/plans?workspace=${workspace}`}
                  className="text-[0.8rem]"
                >
                  <Sparkles className="text-[0.8rem]" />
                  Upgrade
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        )
      )}
      <Collapsible asChild className="group/collapsible">
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
            tooltip={"Suporte"}
          >
            <a href={`/?workspace=${workspace}`} className="text-[0.8rem]">
              <LifeBuoy className="text-[0.8rem]" />
              Suporte
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}
