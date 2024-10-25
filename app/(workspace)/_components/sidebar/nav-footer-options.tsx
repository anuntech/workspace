"use client";

import { LifeBuoy, Sparkles } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { Collapsible } from "@/components/ui/collapsible";

export function NavFooterOptions() {
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");
  const router = useRouter();

  return (
    <SidebarMenu>
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
