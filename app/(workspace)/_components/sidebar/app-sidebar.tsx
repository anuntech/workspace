"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  House,
  Map,
  PieChart,
  Settings,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/app/(workspace)/_components/sidebar/nav-main";
import { NavProjects } from "@/app/(workspace)/_components/sidebar/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/app/(workspace)/_components/sidebar/workspace-switcher";
import { TeamSwitcher } from "@/app/(workspace)/_components/sidebar/team-switcher";
import { NavUser } from "@/app/(workspace)/_components/sidebar/nav-user";
import { NavFooterOptions } from "./nav-footer-options";
import { Separator } from "@/components/ui/separator";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <Separator className="mx-2 hidden group-data-[collapsible=icon]:block" />
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
