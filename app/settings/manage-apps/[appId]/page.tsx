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
import api from "@/libs/api";

export default function MembersPage({ params }: { params: { appId: string } }) {
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => await api.get(`/api/applications/${workspace}`),
  });

  const application = applicationsQuery.data?.data.find(
    (app: any) => app._id === params.appId
  );

  console.log(application);

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
        <div className="w-full max-w-3xl space-y-5 h-full">
          <h1 className="text-2xl flex gap-3">Membros</h1>
          <Separator />
          <Tabs defaultValue="members-manager" className="space-y-10">
            <TabsList>
              <TabsTrigger value="members-manager">
                Gerencenciar membros
              </TabsTrigger>
              {application?.configurationOptions.map((option: any) => {
                switch (option.type) {
                  case "iframe":
                    return (
                      <TabsTrigger key={option.id} value={option.id}>
                        {option.title}
                      </TabsTrigger>
                    );
                  case "sameWindow":
                    return (
                      <a href={option.link} className="w-full">
                        <TabsTrigger
                          key={option.id}
                          value={option.id}
                          className="w-full"
                        >
                          {option.title}
                        </TabsTrigger>
                      </a>
                    );
                  case "newWindow":
                    return (
                      <button
                        onClick={() => window.open(option.link, "_blank")}
                        className="w-full text-left"
                      >
                        <div className="px-3 py-1.5 text-sm font-medium">
                          {option.title}
                        </div>
                      </button>
                    );
                }
              })}
            </TabsList>
            <TabsContent value="members-manager">
              <MembersManager params={params} />
            </TabsContent>
            {application?.configurationOptions.map((option: any) => (
              <TabsContent key={option.id} value={option.id}>
                <iframe
                  src={option.link}
                  width="100%"
                  style={{ border: "none", height: "70vh" }}
                  title="Roteiro Digital"
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </>
  );
}
