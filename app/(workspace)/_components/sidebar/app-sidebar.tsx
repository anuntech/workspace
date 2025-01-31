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
import { NavFavorites } from "./nav-favorites";
import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { NavLinks } from "./nav-links";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const sideBar = useSidebar();
	const session = useSession();
	sideBar.setOpen(
		localStorage?.getItem("sidebar") == "true" ||
			localStorage?.getItem("sidebar") == undefined,
	);

	const urlParams = useSearchParams();
	const workspace = urlParams.get("workspace");
	const applicationsQuery = useQuery({
		queryKey: ["/favorite"],
		queryFn: async () => api.get(`/api/favorite?workspaceId=${workspace}`),
	});

	const applicationsAllowQuery = useQuery({
		queryKey: ["applications/allow"],
		queryFn: async () => api.get(`/api/applications/${workspace}/allow`),
	});

	const isThereFavorite = applicationsQuery.data?.data?.favorites.length > 0;

	const isThereApplicationAllow = applicationsAllowQuery.data?.data?.length > 0;

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
				{isThereFavorite && <NavFavorites />}
				{isThereApplicationAllow && <NavProjects />}
				<NavLinks />
			</SidebarContent>
			<SidebarFooter>
				<NavFooterOptions />
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
