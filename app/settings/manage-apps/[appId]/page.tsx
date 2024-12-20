"use client";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembersManager } from "./_components/members-manager";
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

export default function MembersPage({ params }: { params: { appId: string } }) {
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

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
              <BreadcrumbPage>Membros</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex flex-col items-center p-10">
        <div className="w-full max-w-3xl space-y-5">
          <h1 className="text-2xl flex gap-3">Membros</h1>
          <Separator />
          <Tabs defaultValue="members-manager" className="space-y-10">
            <TabsList>
              <TabsTrigger value="members-manager">
                Gerencenciar membros
              </TabsTrigger>
            </TabsList>
            <TabsContent value="members-manager">
              <MembersManager params={params} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
