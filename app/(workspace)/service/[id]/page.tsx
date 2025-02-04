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

	const applicationsQuery = useQuery({
		queryKey: ["applications"],
		queryFn: async () => {
			return await api.get(`/api/applications/${workspace}`);
		},
	});

	if (!params.id) {
		router.push("/");
		return;
	}

	if (applicationsQuery.isPending) {
		return (
			<div className="h-[100vh] flex justify-center items-center">
				<LoaderCircle className="m-auto animate-spin" />
			</div>
		);
	}

	const app = applicationsQuery.data.data.find(
		(app: any) => app._id === params.id,
	);

	const subFieldUrl = app.fields.find(
		(field: any) => field.key === fieldSubScreen,
	)?.value;

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
								<BreadcrumbPage>{app.name}</BreadcrumbPage>
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
				src={
					!subFieldUrl
						? `${app.applicationUrl}?workspace=${workspace}`
						: `${subFieldUrl}?workspace=${workspace}`
				}
				width="100%"
				height="100%"
				style={{ border: "none" }}
				title="Roteiro Digital"
				onLoad={() => setIsIframeLoading(false)}
			/>
		</>
	);
}
