import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import config from "@/config";
import { env } from "process";
import { RedirectNoneWorkspace } from "@/libs/redirect-none-workspace";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar/app-sidebar";

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
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col m-1 p-4 pt-0 bg-[#F4F4F5] h-[98vh] rounded-md">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
