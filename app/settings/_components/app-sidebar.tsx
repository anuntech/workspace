"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import config from "@/config";
import api from "@/libs/api";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

import { SearchForm } from "@/components/search-form";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function AppSidebar({ ...props }) {
	const [searchQuery, setSearchQuery] = useState("");

	const urlParams = useSearchParams();
	const workspace = urlParams.get("workspace") || "";

	const userQuery = useQuery({
		queryKey: ["user"],
		queryFn: () => fetch("/api/user").then((res) => res.json()),
	});

	// const createPortalMutation = useMutation({
	//   mutationFn: async () =>
	//     await api.post("/api/stripe/create-portal", {
	//       returnUrl: window.location.href,
	//       customerId: userQuery.data?.customerId,
	//     }),
	//   onSuccess: ({ data }) => {
	//     window.location.href = data.url;
	//   },
	//   onError: (err: AxiosError) => {
	//     toast({
	//       title: "Erro ao acessar a fatura",
	//       description: (err.response.data as any)?.error,
	//       variant: "destructive",
	//       duration: 7000,
	//     });
	//   },
	// });

	const emailDomain = userQuery.data?.email?.split("@")[1];

	const isThereNewNotificationQuery = useQuery({
		queryKey: ["isThereNewNotification"],
		queryFn: () => api.get("/api/user/notifications/is-there-new"),
	});

	const applicationsQuery = useQuery({
		queryKey: ["applications"],
		queryFn: async () => await api.get(`/api/applications/${workspace}`),
	});

	const filterMenuItems = (items: any) => {
		return items.filter((item: any) =>
			item.label.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	};

	const router = useRouter();

	const workspaceMenuItems = [
		{ label: "Visão geral", href: `/settings?workspace=${workspace}` },
		{
			label: "Loja de aplicativos",
			href: `/settings/apps?workspace=${workspace}`,
		},
		{ label: "Membros", href: `/settings/members?workspace=${workspace}` },
		{ label: "Planos", href: `/settings/plans?workspace=${workspace}` },
		{
			label: "Faturas",
			href: "https://billing.stripe.com/p/login/28o8wWbMXco02KQ144",
		},
	];

	const filteredWorkspaceMenuItems = filterMenuItems(workspaceMenuItems);

	const accountMenuItems = [
		{ label: "Meu perfil", href: `/settings/account?workspace=${workspace}` },
		{
			label: "Workspaces",
			href: `/settings/account/workspaces?workspace=${workspace}`,
		},
		{
			label: "Notificações",
			href: `/settings/account/notifications?workspace=${workspace}`,
			hasNotification: isThereNewNotificationQuery.data?.data,
		},
	];

	const filteredAccountMenuItems = filterMenuItems(accountMenuItems);

	const enabledApplications = applicationsQuery.data?.data?.filter(
		(app: any) => app.status === "enabled",
	);

	const filteredApplications = enabledApplications?.filter((app: any) =>
		app.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const isAnuntechUser = emailDomain === config.domainName;

	return (
		<Sidebar
			{...props}
			className="bg-[#F4F4F5] border-none"
			defaultChecked={true}
		>
			<SidebarHeader>
				<SidebarMenuButton
					asChild
					className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
				>
					<Link href={`/?workspace=${workspace}`}>
						<ChevronLeft className="size-4" />
						Voltar
					</Link>
				</SidebarMenuButton>
				<Separator />
				<SearchForm
					onChange={(e) => setSearchQuery((e.target as any)!.value)}
					className=""
				/>
			</SidebarHeader>
			<SidebarContent className="gap-0">
				{filteredWorkspaceMenuItems.length > 0 && (
					<Collapsible
						title="Workspace"
						defaultOpen
						className="group/collapsible"
					>
						<SidebarGroup>
							<SidebarGroupLabel
								asChild
								className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
							>
								<CollapsibleTrigger>
									Workspace{" "}
									<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent className="font-normal">
									<SidebarMenu>
										{filteredWorkspaceMenuItems.map((item: any) => {
											if (
												item.label == "Faturas" &&
												userQuery.data?.customerId
											) {
												return (
													<SidebarMenuItem key={item.label}>
														{item.href ? (
															<SidebarMenuButton
																className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
																asChild
															>
																<Link href={item.href}>{item.label}</Link>
															</SidebarMenuButton>
														) : (
															<SidebarMenuButton
																className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
																onClick={item.action}
															>
																{item.label}
															</SidebarMenuButton>
														)}
													</SidebarMenuItem>
												);
											}

											if (item.label != "Faturas") {
												return (
													<SidebarMenuItem key={item.label}>
														{item.href ? (
															<SidebarMenuButton
																className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
																asChild
															>
																<Link href={item.href}>{item.label}</Link>
															</SidebarMenuButton>
														) : (
															<SidebarMenuButton
																className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
																onClick={item.action}
															>
																{item.label}
															</SidebarMenuButton>
														)}
													</SidebarMenuItem>
												);
											}

											return null;
										})}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				)}

				{filteredAccountMenuItems.length > 0 && (
					<Collapsible
						title="Minha conta"
						defaultOpen
						className="group/collapsible"
					>
						<SidebarGroup>
							<SidebarGroupLabel
								asChild
								className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
							>
								<CollapsibleTrigger>
									Minha conta{" "}
									<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent className="font-normal">
									<SidebarMenu>
										{filteredAccountMenuItems.map((item: any) => (
											<SidebarMenuItem key={item.label}>
												<SidebarMenuButton
													className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
													asChild
												>
													<Link
														href={item.href}
														className="flex items-center justify-between"
													>
														{item.label}
														{item.hasNotification && (
															<div
																className="w-2 h-2 mr-1 bg-blue-600 rounded-full"
																title="Notificação nova"
															></div>
														)}
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				)}

				{filteredApplications?.length > 0 && (
					<Collapsible
						title="Aplicativos"
						defaultOpen
						className="group/collapsible"
					>
						<SidebarGroup>
							<SidebarGroupLabel
								asChild
								className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
							>
								<CollapsibleTrigger>
									Aplicativos
									<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent className="font-normal">
									<SidebarMenu>
										{filteredApplications.map((app: any) => (
											<SidebarMenuItem key={app._id}>
												<SidebarMenuButton
													className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
													asChild
												>
													<Link
														href={`/settings/manage-apps/${app._id}?workspace=${workspace}`}
													>
														{app.name}
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				)}

				{/* {isAnuntechUser && (
          <Collapsible
            title="Anuntech"
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  Anuntech
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent className="font-normal">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                        asChild
                      >
                        <Link
                          href={`/settings/account/apps-admin?workspace=${workspace}`}
                        >
                          Administração de aplicativos
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )} */}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
