import { Separator } from "@/components/ui/separator";
import { RenderWorkspaces } from "./_components/render-workspaces";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function WorkspacesPage() {
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
							<BreadcrumbPage>Workspaces</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>
			<main className="flex flex-col items-center p-10">
				<div className="w-full max-w-2xl space-y-5">
					<section>
						<h2 className="text-lg font-bold">Meus workspaces</h2>
						<span className="text-sm text-zinc-500">
							Gerencie seus workspaces e colabore com sua equipe de forma
							eficiente.
						</span>
					</section>
					<RenderWorkspaces />
				</div>
			</main>
		</>
	);
}
