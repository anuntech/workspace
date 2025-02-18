"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
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
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { getS3Image } from "@/libs/s3-client";
import { signOut } from "next-auth/react";
import api from "@/libs/api";
import { IconComponent } from "@/components/get-lucide-icons";

export function NavUser() {
	const { isMobile } = useSidebar();
	const { data } = useQuery({
		queryKey: ["user"],
		queryFn: () => fetch("/api/user").then((res) => res.json()),
	});

	const searchParams = useSearchParams();
	const router = useRouter();

	const isThereNewNotificationQuery = useQuery({
		queryKey: ["isThereNewNotification"],
		queryFn: () => api.get("/api/user/notifications/is-there-new"),
	});

	const hasNewNotification = isThereNewNotificationQuery.data?.data;

	const workspace = searchParams.get("workspace");

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="relative hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground pl-[4px]"
							tooltip={"Perfil"}
						>
							<div className="relative">
								{!data?.icon && (
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={data?.image || "/shad.png"}
											alt="@shadcn"
										/>
										<AvatarFallback className="rounded-lg">SC</AvatarFallback>
									</Avatar>
								)}
								{data?.icon?.type === "emoji" && (
									<span className="text-[1.3rem]">{data.icon.value}</span>
								)}
								{data?.icon?.type === "image" && (
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={getS3Image(data?.icon?.value) || "/shad.png"}
											alt="@shadcn"
										/>
										<AvatarFallback className="rounded-lg">SC</AvatarFallback>
									</Avatar>
								)}
								{data?.icon?.type === "lucide" && (
									<span className="text-[1.3rem]">
										<IconComponent name={data.icon.value} />
									</span>
								)}

								{hasNewNotification && (
									<span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-600" />
								)}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight ml-2">
								<span className="truncate font-semibold">{data?.name}</span>
								<span className="truncate text-xs">{data?.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								{!data?.icon && (
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={data?.image || "/shad.png"}
											alt="@shadcn"
										/>
										<AvatarFallback className="rounded-lg">SC</AvatarFallback>
									</Avatar>
								)}
								{data?.icon?.type === "emoji" && (
									<span className="text-[1.3rem]">{data.icon.value}</span>
								)}
								{data?.icon?.type === "image" && (
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={getS3Image(data?.icon?.value) || "/shad.png"}
											alt="@shadcn"
										/>
										<AvatarFallback className="rounded-lg">SC</AvatarFallback>
									</Avatar>
								)}
								{data?.icon?.type === "lucide" && (
									<span className="text-[1.3rem]">
										<IconComponent name={data.icon.value} />
									</span>
								)}
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{data?.name}</span>
									<span className="truncate text-xs">{data?.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() =>
									router.push(
										`/settings/account?workspaceIdSelected=${workspace}`,
									)
								}
							>
								<BadgeCheck />
								Perfil
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									router.push(
										`/settings/account/notifications?workspaceIdSelected=${workspace}`,
									)
								}
							>
								<Bell />
								<div className="flex items-center w-full justify-between">
									<span>Notificações</span>
									{hasNewNotification && (
										<div
											className="w-2 h-2 bg-blue-600 rounded-full"
											title="Notificação nova"
										></div>
									)}
								</div>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								localStorage.removeItem("completedIntro");
								signOut();
							}}
						>
							<LogOut />
							Sair
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
