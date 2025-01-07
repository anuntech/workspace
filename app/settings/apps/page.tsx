"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { api } from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IconComponent } from "@/components/get-lucide-icons";
import { Button } from "@/components/ui/button";
import config from "@/config";

export default function AppsPage() {
  const [inputValue, setInputValue] = useState("");
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => await api.get(`/api/applications/${workspace}`),
  });

  const workspaceQuery = useQuery({
    queryKey: ["find-workspace"],
    queryFn: async () =>
      api.get(`/api/workspace/${workspace}`).then((res) => res.data),
  });

  const changeTutorialMutation = useMutation({
    mutationFn: () =>
      api.post("/api/workspace/tutorial", {
        pageOpened: "application",
        workspaceId: workspace,
      }),
  });

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  const emailDomain = userQuery.data?.email?.split("@")[1];
  const isAnuntechUser = emailDomain === config.domainName;

  useEffect(() => {
    if (
      workspaceQuery.isFetched &&
      !workspaceQuery.data?.tutorial?.includes("application")
    ) {
      changeTutorialMutation.mutate();
    }
  }, [workspaceQuery.isFetched]);

  if (applicationsQuery.isPending) {
    return <div>Carregando...</div>;
  }

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
              <BreadcrumbPage>Loja de aplicativos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-col items-center p-10">
        <div className="w-full max-w-3xl space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl">Loja de aplicativos</h1>
            {isAnuntechUser && <Button>Adicionar novo aplicativo</Button>}
          </div>
          <Separator />
          <section className="relative flex items-center">
            <Search className="absolute left-4 size-4" />
            <Input
              placeholder="Buscar aplicativo..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="px-11"
            />
          </section>
          {!inputValue.length ? (
            <>
              <section className="space-y-4 py-5">
                <span className="text-sm text-muted-foreground">
                  Instalados
                </span>
                <div className="grid grid-cols-3 gap-5">
                  {applicationsQuery.data?.data
                    .filter((app: any) => app.status === "enabled")
                    .map((app: any) => (
                      <Link
                        href={`/settings/apps/${app._id}?workspace=${workspace}`}
                        key={app.name}
                      >
                        <Card className="relative">
                          {app.workspaceAccess == "premium" && (
                            <div className="absolute top-0 right-0 bg-black text-white px-2 py-1 text-xs font-bold transform rotate-12 shadow-md">
                              Premium
                            </div>
                          )}
                          {app.workspaceAccess == "buyable" && (
                            <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs font-bold transform rotate-12 shadow-md">
                              Comprável
                            </div>
                          )}
                          {app.workspaceAccess == "rentable" && (
                            <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs font-bold transform rotate-12 shadow-md">
                              Alugável
                            </div>
                          )}
                          <CardContent className="flex items-center gap-3 p-5">
                            {app.icon?.type == "emoji" && (
                              <p className="text-[2rem]">{app.icon.value}</p>
                            )}
                            {app.icon?.type == "lucide" && (
                              <IconComponent
                                className="text-[2rem]"
                                name={app.icon?.value}
                              />
                            )}
                            {(app.icon?.type == "image" || !app.icon) && (
                              <Avatar>
                                <AvatarImage
                                  src={getS3Image(
                                    app.icon?.value || app.avatarSrc
                                  )}
                                />
                                <AvatarFallback>
                                  {app.avatarFallback}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div className="flex flex-col">
                              <span>{app.name}</span>
                              <span className="text-xs text-muted-foreground">
                                Instalado
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              </section>
              <Separator />
              <section className="space-y-4 py-5">
                <span className="text-sm text-muted-foreground">
                  Desinstalados
                </span>
                <div className="grid grid-cols-3 gap-5">
                  {applicationsQuery?.data?.data
                    .filter((app: any) => app.status === "disabled")
                    ?.map((app: any) => (
                      <App app={app} workspace={workspace} />
                    ))}
                </div>
              </section>
            </>
          ) : (
            <section className="grid grid-cols-3 gap-5 py-5">
              {applicationsQuery.data?.data
                .filter((app: any) =>
                  app.name.toLowerCase().includes(inputValue.toLowerCase())
                )
                ?.map((app: any) => (
                  <App app={app} workspace={workspace} />
                ))}
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function App({ app, workspace }: { app: any; workspace: string }) {
  return (
    <Link
      href={`/settings/apps/${app._id}?workspace=${workspace}`}
      key={app.name}
    >
      <Card className="relative w-64 h-36">
        {app.workspaceAccess == "premium" && (
          <div className="absolute top-0 right-0 bg-black text-white px-2 py-1 text-xs font-bold transform rotate-12 shadow-md">
            Premium
          </div>
        )}
        {app.workspaceAccess == "buyable" && (
          <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs font-bold transform rotate-12 shadow-md">
            Comprável
          </div>
        )}
        {app.workspaceAccess == "rentable" && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs font-bold transform rotate-12 shadow-md">
            Alugável
          </div>
        )}
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-3">
            {app.icon?.type == "emoji" && (
              <p className="text-[2rem]">{app.icon.value}</p>
            )}
            {app.icon?.type == "lucide" && (
              <IconComponent className="size-[2rem]" name={app.icon?.value} />
            )}
            {(app.icon?.type == "image" || !app.icon) && (
              <Avatar>
                <AvatarImage
                  src={getS3Image(app.icon?.value || app.avatarSrc)}
                />
                <AvatarFallback>{app.avatarFallback}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col">
              <span>{app.name}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-3">
            {app.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
