"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import api from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";
import { IconComponent } from "@/components/get-lucide-icons";

export function TeamSwitcher() {
	const router = useRouter();
	const urlParams = useSearchParams();
	const { isMobile } = useSidebar();

	const [filter, setFilter] = useState("");

	const { data, isSuccess, isPending } = useQuery({
		queryKey: ["workspace"],
		queryFn: () => api.get("/api/workspace"),
	});

	const selectedWorkspace = urlParams.get("workspace");

	useEffect(() => {
		if (!isSuccess) return;
		const workspaces = data?.data ?? [];

		if (!selectedWorkspace && workspaces.length > 0) {
			router.push(`/?workspace=${workspaces[0].id}`);
		}
	}, [isSuccess, data, selectedWorkspace, router]);

	if (isPending) {
		return <Skeleton className="h-11" />;
	}

	const workspaces = data?.data ?? [];

	const activeWorkspace = workspaces.find(
		(ws: any) => ws.id === selectedWorkspace,
	);

	if (!selectedWorkspace || !activeWorkspace) {
		router.push(`/?workspace=${workspaces[0]?.id}`);
		return null;
	}

	const filtered = workspaces.filter((team: any) =>
		team.name.toLowerCase().includes(filter.toLowerCase()),
	);

	const handleCreateWorkspace = () => {
		router.push("/create-workspace");
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							tooltip="Workspaces"
							className="
                data-[state=open]:bg-sidebar-accent 
                data-[state=open]:text-sidebar-accent-foreground
                group-data-[collapsible=icon]:flex
                group-data-[collapsible=icon]:items-center 
                group-data-[collapsible=icon]:justify-center
                hover:bg-gray-200 
                hover:text-gray-900
                transition-colors
                duration-150
              "
						>
							{activeWorkspace.icon.type === "emoji" && (
								<p className="text-[25px]">{activeWorkspace.icon.value}</p>
							)}

							{activeWorkspace.icon.type === "image" && (
								<div className="flex aspect-square size-7 items-center justify-center rounded-lg">
									<img
										src={getS3Image(activeWorkspace.icon.value)}
										alt="Workspace icon"
										className="rounded-lg"
									/>
								</div>
							)}

							{activeWorkspace.icon.type === "lucide" && (
								<div className="text-[25px]">
									<IconComponent name={activeWorkspace.icon.value} />
								</div>
							)}

							<div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
								<span className="truncate font-semibold">
									{activeWorkspace.name}
								</span>
							</div>

							{activeWorkspace.plan === "premium" && (
								<Badge className="mr-2 group-data-[collapsible=icon]:hidden">
									Premium
								</Badge>
							)}

							<ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
					>
						<div className="flex items-center">
							<Search className="h-4" />
							<Input
								placeholder="Procurar workspace..."
								className="h-7 border-none focus-visible:ring-0 shadow-none focus-visible:outline-none"
								onChange={(e) => setFilter(e.target.value)}
							/>
						</div>

						<DropdownMenuSeparator />

						<div className="max-h-80 overflow-y-auto overflow-x-hidden">
							<DropdownMenuLabel className="text-xs text-muted-foreground">
								Workspaces
							</DropdownMenuLabel>

							{filtered.map((team: any) => (
								<DropdownMenuItem key={team.id} className="gap-2">
									<a
										href={`/?workspace=${team.id}`}
										className="flex w-full items-center justify-between"
									>
										<div className="flex items-center gap-3">
											<div className="flex size-6 items-center justify-center rounded-sm border">
												{team.icon.type === "emoji" && team.icon.value}

												{team.icon.type === "image" && (
													<div className="flex w-5 h-5 items-center justify-center">
														<img
															src={getS3Image(team.icon.value)}
															alt="Workspace icon"
															className="rounded-sm"
														/>
													</div>
												)}

												{team.icon.type === "lucide" && (
													<IconComponent name={team.icon.value} />
												)}
											</div>

											<div className="grid flex-1 text-left text-sm leading-tight">
												<span className="truncate">{team.name}</span>
											</div>
										</div>

										{team.plan === "premium" && (
											<Badge className="ml-auto">Premium</Badge>
										)}
									</a>
								</DropdownMenuItem>
							))}
						</div>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							onClick={handleCreateWorkspace}
							className="gap-2 p-2"
						>
							<div className="flex size-6 items-center justify-center rounded-md border bg-background">
								<Plus className="size-4" />
							</div>
							<span className="font-medium text-muted-foreground">
								Criar workspace
							</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
