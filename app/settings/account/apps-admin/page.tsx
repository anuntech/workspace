"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api";
import { ApplicationItem } from "./_components/application-tem";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AppsAdminPage() {
	const searchParams = useSearchParams();
	const allAppsQuery = useQuery({
		queryKey: ["allApplications"],
		queryFn: async () => await api.get(`/api/applications`),
	});
	const [search, setSearch] = useState("");

	const workspace = searchParams.get("workspace");

	return (
		<>
			<header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="#">Minha conta</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Administração de aplicativos</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>

			<div className="flex flex-col items-center p-10">
				<div className="w-full max-w-3xl space-y-5">
					<h1 className="text-2xl">Aplicações</h1>
					<div className="flex justify-between items-center">
						<Input
							type="text"
							placeholder="Procurar aplicativos..."
							className="w-2/3"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Button className="ml-4">
							<Link href={`/settings/account/admin?workspace=${workspace}`}>
								Criar aplicativo
							</Link>
						</Button>
					</div>

					<div className="space-y-5">
						{search == ""
							? allAppsQuery.data?.data.map(
									(application: any, index: number) => (
										<ApplicationItem application={application} key={index} />
									),
								)
							: allAppsQuery.data?.data
									.filter((application: any) =>
										application.name
											.toLowerCase()
											.includes(search.toLowerCase()),
									)
									.map((application: any, index: number) => (
										<ApplicationItem application={application} key={index} />
									))}
					</div>
				</div>
			</div>
		</>
	);
}
