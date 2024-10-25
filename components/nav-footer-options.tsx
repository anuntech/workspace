"use client";

import { LifeBuoy, Sparkles } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { Collapsible } from "./ui/collapsible";

export function NavFooterOptions() {
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");
  const router = useRouter();

  return (
    <SidebarMenu>
      <Collapsible asChild className="group/collapsible">
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
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
      <Collapsible asChild className="group/collapsible">
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
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
