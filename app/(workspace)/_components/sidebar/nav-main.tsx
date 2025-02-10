"use client";

import { Brain, Code, Cpu, House, Server, Settings } from "lucide-react";

import { Collapsible } from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
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
			<SidebarGroupLabel>Menu</SidebarGroupLabel>
			<SidebarMenu>
				<Collapsible asChild className="group/collapsible">
					<SidebarMenuItem>
						<SidebarMenuButton
							className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
							asChild
							tooltip={"Dashboard"}
						>
							<Link href={`/?workspace=${workspace}`}>
								<House />
								<span>Página Inicial</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</Collapsible>
				<Collapsible asChild className="group/collapsible">
					<SidebarMenuItem>
						<SidebarMenuButton
							className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
							asChild
							tooltip={"Anuntech IA"}
						>
							<Link href={`/ia?workspace=${workspace}`}>
								<Cpu />
								<span>Anuntech IA</span>
							</Link>
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
