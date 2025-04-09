import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import config from "@/config";
import { RedirectNoneWorkspace } from "@/libs/redirect-none-workspace";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar/app-sidebar";
import React from "react";

export default async function WorkspaceLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect(config.auth.loginUrl);
	}

	return (
		<SidebarProvider>
			<RedirectNoneWorkspace>
				<AppSidebar />
				<SidebarInset className="bg-[#F4F4F5]">
					<div className="flex flex-1 bg-white flex-col pt-0 h-[100vh]">
						{children}
					</div>
				</SidebarInset>
			</RedirectNoneWorkspace>
		</SidebarProvider>
	);
}
