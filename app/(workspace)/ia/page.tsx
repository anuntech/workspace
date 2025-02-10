"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

export default function IA() {
	const sideBar = useSidebar();
	const [isIframeLoading, setIsIframeLoading] = useState(true);

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
								<BreadcrumbLink href="#">Anuntech IA</BreadcrumbLink>
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
				src="https://ia.anun.tech"
				width="100%"
				height="100%"
				style={{ border: "none" }}
				title="Roteiro Digital"
				onLoad={() => setIsIframeLoading(false)}
			/>
		</>
	);
}
