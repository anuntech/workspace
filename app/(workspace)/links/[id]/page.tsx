"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { api } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";
import { Loader, LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ServicePage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const workspace = searchParams.get("workspace");
	const fieldSubScreen = searchParams.get("fieldSubScreen");
	const sideBar = useSidebar();
	const [isIframeLoading, setIsIframeLoading] = useState(true);

	const linksQuery = useQuery({
		queryKey: ["workspace/links"],
		queryFn: async () =>
			api.get(`/api/workspace/link?workspaceId=${workspace}`),
	});

	const route = useRouter();

	if (!params.id) {
		router.push("/");
		return;
	}

	if (linksQuery.isPending) {
		return (
			<div className="h-[100vh] flex justify-center items-center">
				<LoaderCircle className="m-auto animate-spin" />
			</div>
		);
	}

	const app = linksQuery?.data?.data?.links?.find(
		(app: any) => app._id === params.id,
	);
	const subFieldUrl = app?.fields?.find(
		(field: any) => field.key === fieldSubScreen,
	)?.value;

	if (!app) {
		route.push(`/?workspace=${workspace}`);
		return;
	}

	return (
		<>
			<header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
				<div className="flex items-center gap-2">
					<SidebarTrigger
						onClick={() =>
							localStorage.setItem("sidebar", String(!sideBar.open))
						}
						className="-ml-1"
					/>
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="#">Aplicativos</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>{app?.title}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			{isIframeLoading && (
				<div className="h-[100vh] flex justify-center items-center">
					<LoaderCircle className="m-auto animate-spin text-[#3b82f6]" />
				</div>
			)}
			<iframe
				src={!subFieldUrl ? app.url : subFieldUrl}
				width="100%"
				height="100%"
				style={{ border: "none" }}
				title="Roteiro Digital"
				onLoad={() => setIsIframeLoading(false)}
			/>
		</>
	);
}
