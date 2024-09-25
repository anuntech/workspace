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

const apps = [
  {
    name: "GitHub",
    status: "enabled",
    avatarSrc: "/shad.png",
    avatarFallback: "GH",
    description:
      "Plataforma de hospedagem de código para controle de versão e colaboração.",
  },
  {
    name: "Slack",
    status: "disabled",
    avatarSrc: "/shad.png",
    avatarFallback: "SL",
    description:
      "Ferramenta de comunicação em equipe com canais organizados e integração com diversos serviços.",
  },
  {
    name: "Jira",
    status: "enabled",
    avatarSrc: "/shad.png",
    avatarFallback: "JR",
    description:
      "Software de gerenciamento de projetos para desenvolvimento ágil e rastreamento de issues.",
  },
  {
    name: "Notion",
    status: "disabled",
    avatarSrc: "/shad.png",
    avatarFallback: "NT",
    description:
      "Aplicativo de organização e produtividade, combinando notas, tarefas e wikis.",
  },
  {
    name: "Trello",
    status: "disabled",
    avatarSrc: "/shad.png",
    avatarFallback: "TR",
    description:
      "Ferramenta de gerenciamento de projetos baseada em quadros de tarefas organizados em listas.",
  },
  {
    name: "Figma",
    status: "enabled",
    avatarSrc: "/shad.png",
    avatarFallback: "FG",
    description:
      "Editor de gráficos vetoriais e prototipagem com colaboração em tempo real.",
  },
  {
    name: "Asana",
    status: "enabled",
    avatarSrc: "/shad.png",
    avatarFallback: "AS",
    description:
      "Ferramenta de gerenciamento de tarefas e projetos para equipes.",
  },
  {
    name: "Zoom",
    status: "disabled",
    avatarSrc: "/shad.png",
    avatarFallback: "ZM",
    description:
      "Plataforma de videoconferência para reuniões, webinars e colaboração remota.",
  },
  {
    name: "Dropbox",
    status: "enabled",
    avatarSrc: "/shad.png",
    avatarFallback: "DB",
    description:
      "Serviço de armazenamento em nuvem para arquivos, com sincronização entre dispositivos.",
  },
  {
    name: "Google Drive",
    status: "disabled",
    avatarSrc: "/shad.png",
    avatarFallback: "GD",
    description:
      "Serviço de armazenamento em nuvem da Google, com integração com Google Docs e outros apps.",
  },
  {
    name: "Microsoft Teams",
    status: "enabled",
    avatarSrc: "/shad.png",
    avatarFallback: "MT",
    description:
      "Plataforma de comunicação e colaboração, parte do Microsoft 365.",
  },
  {
    name: "Adobe XD",
    status: "disabled",
    avatarSrc: "/shad.png",
    avatarFallback: "XD",
    description:
      "Ferramenta de design de interfaces e prototipagem, focada em UX/UI.",
  },
  {
    name: "VS Code",
    status: "enabled",
    avatarSrc: "/shad.png",
    avatarFallback: "VS",
    description:
      "Editor de código-fonte leve e poderoso, com suporte para várias linguagens de programação.",
  },
  {
    name: "Evernote",
    status: "disabled",
    avatarSrc: "/shad.png",
    avatarFallback: "EV",
    description:
      "Aplicativo para organização de notas, tarefas e armazenamento de informações.",
  },
  {
    name: "Skype",
    status: "disabled",
    avatarSrc: "/shad.png",
    avatarFallback: "SK",
    description:
      "Aplicativo de comunicação para mensagens, chamadas de voz e vídeo.",
  },
];

export default function AppsPage() {
  const [inputValue, setInputValue] = useState("");
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res = await fetch("/api/applications");
      return res.json();
    },
  });

  if (applicationsQuery.isLoading) {
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
              <span className="text-sm text-muted-foreground">Habilitados</span>
              <div className="grid grid-cols-3 gap-5">
                {applicationsQuery?.data
                  ?.filter((app: any) => app.status === "enabled")
                  .map((app: any) => (
                    <Link href="/" key={app.name}>
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
                              Habilitado
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
                Desabilitados
              </span>
              <div className="grid grid-cols-3 gap-5">
                {applicationsQuery?.data
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
                              <AvatarImage src={app.avatarSrc} />
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
            {apps
              .filter((app) =>
                app.name.toLowerCase().includes(inputValue.toLowerCase())
              )
              ?.map((app) => (
                <Link href="/" key={app.name}>
                  <Card>
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={app.avatarSrc} />
                          <AvatarFallback>{app.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{app.name}</span>
                          {app.status === "enabled" && (
                            <span className="text-xs text-muted-foreground">
                              Habilitado
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
