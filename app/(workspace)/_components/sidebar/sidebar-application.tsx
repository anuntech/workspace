"use client";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "../../../../components/ui/skeleton";
import Link from "next/link";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "../../../../components/ui/avatar";
import { getS3Image } from "@/libs/s3-client";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconComponent } from "@/components/get-lucide-icons";
import { DropdownApplication } from "./dropdown-application";
import { DropdownLink } from "./dropdown-link";

export function SidebarApplication({
	data,
	workspace,
	isLink,
}: {
	data: any;
	workspace: string | null;
	isLink?: boolean;
}) {
	const [isHovering, setIsHovering] = useState(false);
	const buttonRef = useRef<HTMLDivElement>(null);

	let LinkRedirection: { href: string; target?: string } = { href: "" };

	switch (data.applicationUrlType) {
		case "iframe":
			LinkRedirection = {
				href: `/${isLink ? "links" : "service"}/${data.id}?workspace=${workspace}`,
			};
			break;
		case "newWindow":
			LinkRedirection = {
				href: data.applicationUrl,
				target: "_blank",
			};
			break;
		case "sameWindow":
			LinkRedirection = { href: data.applicationUrl };
			break;
		default:
			LinkRedirection = {
				href: "#",
			};
			break;
	}

	return (
		<SidebarMenuItem>
			<Accordion type="multiple">
				{data.fields.length > 0 ? (
					<AccordionItem value="item-1" className="border-none">
						<SidebarMenuButton
							asChild
							className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
							tooltip={data.name}
							onMouseEnter={() => setIsHovering(true)}
							onMouseLeave={() => setIsHovering(false)}
						>
							<div className="flex items-center justify-between w-full">
								<Link
									{...LinkRedirection}
									passHref
									className="flex items-center"
								>
									<div className="flex w-5 items-center justify-center">
										{data.icon?.type === "emoji" && (
											<p className=" pointer-events-none">{data.icon.value}</p>
										)}
										{data.icon?.type === "lucide" && (
											<IconComponent
												className="size-5 pointer-events-none"
												name={data.icon.value}
											/>
										)}
										{(data.icon?.type === "image" || !data.icon) && (
											<Avatar className="size-5">
												<AvatarImage
													src={getS3Image(data.icon?.value || data.avatarSrc)}
												/>
												<AvatarFallback>{data.avatarFallback}</AvatarFallback>
											</Avatar>
										)}
									</div>
									<span className="ml-3">{data.name}</span>
								</Link>

								<div className="flex items-center gap-2">
									{isLink ? (
										<DropdownLink
											isHover={isHovering}
											linkId={data.id}
											className="text-muted-foreground"
										/>
									) : (
										<DropdownApplication
											isHover={isHovering}
											applicationId={data.id}
											className="text-muted-foreground"
										/>
									)}
									<AccordionTrigger />
								</div>
							</div>
						</SidebarMenuButton>

						<AccordionContent className="pb-0">
							{data.fields.map((field: any) => {
								let LinkRedirection: { href: string; target?: string } = {
									href: "",
								};
								switch (field.redirectType) {
									case "iframe":
										LinkRedirection = {
											href: `/${isLink ? "links" : "service"}/${data.id}?workspace=${workspace}&fieldSubScreen=${field.key}`,
										};
										break;
									case "newWindow":
										LinkRedirection = {
											href: field.value,
											target: "_blank",
										};
										break;
									case "sameWindow":
										LinkRedirection = { href: field.value };
										break;
									default:
										LinkRedirection = {
											href: `/${isLink ? "links" : "service"}/${data.id}?workspace=${workspace}&fieldSubScreen=${field.key}`,
										};
										break;
								}

								return (
									<Link key={field.key} {...LinkRedirection}>
										<Button
											id={field.key}
											variant="ghost"
											className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150 w-full justify-start pl-10 relative before:content-['•'] before:absolute before:left-6 before:text-gray-500 h-4 py-4"
										>
											{field.key}
										</Button>
									</Link>
								);
							})}
						</AccordionContent>
					</AccordionItem>
				) : (
					<SidebarMenuButton
						asChild
						className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
						tooltip={data.name}
						onMouseEnter={() => setIsHovering(true)}
						onMouseLeave={() => setIsHovering(false)}
					>
						<div
							className="flex items-center justify-between w-full"
							ref={buttonRef}
						>
							<Link {...LinkRedirection} passHref className="flex items-center">
								<div className="flex w-5 items-center justify-center">
									{data.icon?.type === "emoji" && (
										<p className=" pointer-events-none">{data.icon.value}</p>
									)}
									{data.icon?.type === "lucide" && (
										<IconComponent
											className="size-5 pointer-events-none"
											name={data.icon.value}
										/>
									)}
									{data.icon?.type === "favicon" && (
										<Avatar className="size-5">
											<AvatarImage src={data.icon?.value || data.avatarSrc} />
											<AvatarFallback>{data.avatarFallback}</AvatarFallback>
										</Avatar>
									)}
									{(data.icon?.type === "image" || !data.icon) && (
										<Avatar className="size-5">
											<AvatarImage
												src={getS3Image(data.icon?.value || data.avatarSrc)}
											/>
											<AvatarFallback>{data.avatarFallback}</AvatarFallback>
										</Avatar>
									)}
								</div>
								<span className="ml-3">{data.name}</span>
							</Link>

							{isLink ? (
								<DropdownLink
									isHover={isHovering}
									linkId={data.id}
									className="text-muted-foreground"
								/>
							) : (
								<DropdownApplication
									isHover={isHovering}
									applicationId={data.id}
									className="text-muted-foreground"
								/>
							)}
						</div>
					</SidebarMenuButton>
				)}
			</Accordion>
		</SidebarMenuItem>
	);
}
