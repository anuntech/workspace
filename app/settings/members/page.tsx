"use client";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Invites } from "./_components/invites";
import { Members } from "./_components/members";
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
import { Skeleton } from "@/components/ui/skeleton";

export default function MembersPage() {
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  const membersQuery = useQuery({
    queryKey: ["workspace/members"],
    queryFn: () => api.get(`/api/workspace/members/${workspace}`),
  });

  const plansQuery = useQuery({
    queryKey: ["workspace/plans"],
    queryFn: () => api.get(`/api/workspace/plans`),
  });

  const workspaceQuery = useQuery({
    queryKey: ["workspace"],
    queryFn: () => api.get(`/api/workspace`),
  });

  const actualWorkspace = workspaceQuery.data?.data?.find(
    (v: any) => v.id === workspace
  );

  const plan = plansQuery.data?.data?.find(
    (pl: any) => pl.name == actualWorkspace?.plan
  );

  const membersQuantity = membersQuery.data?.data?.length + 1;

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
          <h1 className="text-2xl flex gap-3">
            Membros{" "}
            {!membersQuery.isPending && !plansQuery.isPending ? (
              `(${membersQuantity}/${plan?.membersLimit})`
            ) : (
              <Skeleton className="w-11" />
            )}
          </h1>
          <Separator />
          <Tabs defaultValue="members" className="space-y-10">
            <TabsList>
              <TabsTrigger value="members">Membros</TabsTrigger>
              <TabsTrigger value="invites">Convites</TabsTrigger>
            </TabsList>
            <TabsContent value="members">
              <Members />
            </TabsContent>
            <TabsContent value="invites">
              <Invites />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
