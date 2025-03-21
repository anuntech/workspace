"use client";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import api from "@/libs/api";
import { Configs } from "./_components/configs";
import { MenuMain } from "./_components/menu-main";
import { MenuConfig } from "./_components/menu-config";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export interface Field {
	key: string;
	redirectType: "none" | "iframe" | "newWindow" | "sameWindow";
	value: string;
	_id: string;
}

export interface Config {
	title: string;
	link: string;
	type: "none" | "iframe" | "newWindow" | "sameWindow";
	_id: string;
}

interface IApp {
	applicationUrl: string;
	applicationUrlType: "none" | "iframe" | "newWindow" | "sameWindow";
	name: string;
	cta: string;
	description: string;
	avatarSrc: string;
	icon: {
		type: "emoji" | "lucide";
		value: string;
	};
	galleryPhotos?: FileList;
	fields: Array<Field>;
	_id: string;
	configurationOptions: Array<Config>;
}

export default function EditPage({ params }: { params: { appId: string } }) {
	const searchParams = useSearchParams();
	const workspace = searchParams.get("workspace");

	const applicationsQuery = useQuery({
		queryKey: ["applications"],
		queryFn: async () => await api.get(`/api/applications/${workspace}`),
		staleTime: 0,
		retryDelay: 100,
	});

	const application = applicationsQuery.data?.data.find(
		(app: any) => app._id === params.appId,
	) as IApp;

	if (!application) return <></>;

	return (
		<>
			<header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="#">Workspace</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Loja de aplicativos</BreadcrumbPage>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>{application.name}</BreadcrumbPage>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Editar</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>
			<main className="flex flex-col items-center p-10">
				<div className="w-full max-w-3xl space-y-5 h-full">
					<Link
						href={`/settings/apps/${application._id}?workspace=${workspace}`}
						className="flex w-max items-center gap-2 text-sm"
					>
						<ChevronLeft className="size-4" />
						{application.name}
					</Link>
					<Separator />
					<Tabs defaultValue="configs" className="space-y-10">
						<TabsList className="gap-2">
							<TabsTrigger value="configs">Configurações</TabsTrigger>
							<TabsTrigger value="menu-main">Menu principal</TabsTrigger>
							<TabsTrigger value="menu-configs">
								Menu de configurações
							</TabsTrigger>
						</TabsList>
						<TabsContent value="configs">
							<Configs
								data={{
									basicInformation: {
										name: application.name,
										subtitle: application.cta,
										description: application.description,
									},
									images: {
										imageUrlWithoutS3: application.avatarSrc,
										emojiAvatar: application.icon.value,
										emojiAvatarType: application.icon.type,
										galleryPhotos: application.galleryPhotos,
									},
								}}
								id={application._id}
							/>
						</TabsContent>
						<TabsContent value="menu-main">
							<MenuMain
								data={{
									basicInformation: {
										name: application.name,
									},
									principalLink: {
										applicationUrl: application.applicationUrl,
										applicationUrlType: application.applicationUrlType,
									},
									subLinks: application.fields,
								}}
								id={application._id}
							/>
						</TabsContent>
						<TabsContent value="menu-configs">
							<MenuConfig
								data={{
									subLinks: application.configurationOptions,
								}}
								id={application._id}
							/>
						</TabsContent>
					</Tabs>
				</div>
			</main>
		</>
	);
}
