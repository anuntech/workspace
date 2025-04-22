import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import config from "@/config";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { RedirectIsMember } from "@/libs/redirect-is-member";
import { ReactNode } from "react";

export default async function SettingsLayout({
	children,
}: {
	children: ReactNode;
}) {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect(config.auth.loginUrl);
	}

	return (
		<SidebarProvider>
			<RedirectIsMember>
				<AppSidebar />
				<SidebarInset className="bg-[#F4F4F5]">
					<div className="flex flex-1 bg-white flex-col pt-0 h-[100vh]">
						{children}
					</div>
				</SidebarInset>
			</RedirectIsMember>
		</SidebarProvider>
	);
}
