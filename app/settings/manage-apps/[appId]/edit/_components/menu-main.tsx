"use client";

import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";

import { Field } from "../page";
import { LinkFormComponent } from "./_components/link-form";

interface Props {
	data: {
		basicInformation: {
			name: string;
		};
		principalLink: {
			applicationUrl: string;
			applicationUrlType: "none" | "iframe" | "newWindow" | "sameWindow";
		};
		subLinks: Array<Field>;
	};
	id: string;
}

export const MenuMain = ({ data, id }: Props) => {
	return (
		<div className="flex flex-col w-full max-w-lg gap-4 items-end">
			<Collapsible
				title={data.basicInformation.name}
				defaultOpen
				className="group/collapsible w-full"
			>
				<SidebarGroup>
					<SidebarGroupLabel
						asChild
						className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
					>
						<div className="flex items-center justify-between w-full">
							{data.basicInformation.name}
							<div className="flex items-center justify-center">
								<LinkFormComponent
									data={{
										basicInformation: data.basicInformation,
										link: {
											applicationUrl: data.principalLink.applicationUrl,
											applicationUrlType: data.principalLink.applicationUrlType,
										},
									}}
									id={id}
									menuType="menu-main"
									linkType="principal-link"
								/>
								<CollapsibleTrigger asChild>
									<Button variant="ghost">
										<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
									</Button>
								</CollapsibleTrigger>
							</div>
						</div>
					</SidebarGroupLabel>
					<CollapsibleContent>
						<SidebarGroupContent className="font-normal grid gap-4">
							<SidebarMenu>
								{data.subLinks.map((item) => (
									<SidebarMenuItem key={item._id}>
										<SidebarMenuButton
											className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
											asChild
										>
											<LinkFormComponent
												data={{
													basicInformation: {
														name: item.key,
													},
													link: {
														applicationUrl: item.value,
														applicationUrlType: item.redirectType,
													},
												}}
												id={id}
												fieldId={item._id}
												menuType="menu-main"
												linkType="sub-link-edit"
												openButtonText={item.key}
											/>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
							<LinkFormComponent
								data={{
									basicInformation: {
										name: "",
									},
									link: {
										applicationUrl: "",
										applicationUrlType: "iframe",
									},
								}}
								id={id}
								menuType="menu-main"
								linkType="sub-link-create"
								openButtonText="Adicionar sublink"
							/>
						</SidebarGroupContent>
					</CollapsibleContent>
				</SidebarGroup>
			</Collapsible>
		</div>
	);
};
