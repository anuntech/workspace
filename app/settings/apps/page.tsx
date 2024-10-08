"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { api } from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";

export default function AppsPage() {
  const [inputValue, setInputValue] = useState("");
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => await api.get(`/api/applications/${workspace}`),
  });

  if (applicationsQuery.isPending || applicationsQuery.data.status !== 200) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col items-center p-10">
      <div className="w-full max-w-3xl space-y-5">
        <h1 className="text-2xl">Loja de aplicativos</h1>
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
              <span className="text-sm text-muted-foreground">Instalados</span>
              <div className="grid grid-cols-3 gap-5">
                {applicationsQuery.data.data
                  .filter((app: any) => app.status === "enabled")
                  .map((app: any) => (
                    <Link
                      href={`/settings/apps/${app._id}?workspace=${workspace}`}
                      key={app.name}
                    >
                      <Card>
                        <CardContent className="flex items-center gap-3 p-5">
                          <Avatar>
                            <AvatarImage src={app.avatarSrc} />
                            <AvatarFallback>
                              {app.avatarFallback}
                            </AvatarFallback>
                          </Avatar>
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
                {applicationsQuery?.data.data
                  .filter((app: any) => app.status === "disabled")
                  ?.map((app: any) => (
                    <Link
                      href={`/settings/apps/${app._id}?workspace=${workspace}`}
                      key={app.name}
                    >
                      <Card>
                        <CardContent className="space-y-3 p-5">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={getS3Image(app.avatarSrc)} />
                              <AvatarFallback>
                                {app.avatarFallback}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span>{app.name}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {app.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </section>
          </>
        ) : (
          <section className="grid grid-cols-3 gap-5 py-5">
            {applicationsQuery.data.data
              .filter((app: any) =>
                app.name.toLowerCase().includes(inputValue.toLowerCase())
              )
              ?.map((app: any) => (
                <Link href="/" key={app.name}>
                  <Card>
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={getS3Image(app.avatarSrc)} />
                          <AvatarFallback>{app.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{app.name}</span>
                          {app.status === "enabled" && (
                            <span className="text-xs text-muted-foreground">
                              Instalado
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {app.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </section>
        )}
      </div>
    </div>
  );
}
