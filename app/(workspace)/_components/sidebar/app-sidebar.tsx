"use client";

import * as React from "react";

import { NavMain } from "@/app/(workspace)/_components/sidebar/nav-main";
import { NavProjects } from "@/app/(workspace)/_components/sidebar/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/app/(workspace)/_components/sidebar/workspace-switcher";
import { TeamSwitcher } from "@/app/(workspace)/_components/sidebar/team-switcher";
import { NavUser } from "@/app/(workspace)/_components/sidebar/nav-user";
import { NavFooterOptions } from "./nav-footer-options";
import { Separator } from "@/components/ui/separator";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sideBar = useSidebar();
  sideBar.setOpen(localStorage?.getItem("sidebar") == "true");

  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#F4F4F5] border-none" // Add your custom background color here
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <NavFooterOptions />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
