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

export interface Field {
	key: string
	redirectType: "none" | "iframe" | "newWindow" | "sameWindow";
	value: string;
	_id: string;
}

interface IApp {
	applicationUrl: string;
	applicationUrlType: "none" | "iframe" | "newWindow" | "sameWindow";
	name: string
	cta: string;
	description: string;
	avatarSrc: string;
	icon: {
		type: "emoji" | "lucide";
		value: string;
	}
	galleryPhotos?: FileList;
	fields: Array<Field>
	_id: string;
}

export default function EditPage({ params }: { params: { appId: string } }) {
	const searchParams = useSearchParams();
	const workspace = searchParams.get("workspace");

	const applicationsQuery = useQuery({
		queryKey: ["applications"],
		queryFn: async () => await api.get(`/api/applications/${workspace}`),
	});

	const application = applicationsQuery.data?.data.find(
		(app: any) => app._id === params.appId
	) as IApp;

	if (!application) return <></>

	console.log(application);

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
							<BreadcrumbPage>Editar</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>
			<main className="flex flex-col items-center p-10">
				<div className="w-full max-w-3xl space-y-5 h-full">
					<h1 className="text-2xl flex gap-3 text-muted-foreground">Tabs</h1>
					<Separator />
					<Tabs defaultValue="configs" className="space-y-10">
						<TabsList className="gap-2">
							<TabsTrigger value="configs">
								Configurações
							</TabsTrigger>
							<TabsTrigger value="menu-main">
								Menu principal
							</TabsTrigger>
							<TabsTrigger value="menu-configs">
								Menu de configurações
							</TabsTrigger>
						</TabsList>
						<TabsContent value="configs">
							<Configs data={{
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
								}
							}} id={application._id} />
						</TabsContent>
						<TabsContent value="menu-main">
							<MenuMain data={{
								basicInformation: {
									name: application.name,
								},
								principalLink: {
									applicationUrl: application.applicationUrl,
									applicationUrlType: application.applicationUrlType,
								},
								subLinks: application.fields
							}} id={application._id} />
						</TabsContent>
					</Tabs>
				</div>
			</main>
		</>
	);
}
