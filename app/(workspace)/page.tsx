"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  PlusSquare,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function WorkspacePage() {
  const workspace = useSearchParams().get("workspace");

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  const quantity = userQuery.data?.pagesOpened
    ? userQuery.data?.pagesOpened?.length
    : 0;

  // Calcula progresso
  let percent;
  switch (quantity) {
    case 1:
      percent = 33;
      break;
    case 2:
      percent = 66;
      break;
    case 3:
      percent = 100;
      break;
    default:
      percent = 0;
  }

  // Verifica se cada etapa já foi concluída
  const isInviteMembersFinished = userQuery.data?.pagesOpened?.some(
    (page: any) => page.name === "invitation"
  );
  const isApplicationsFinished = userQuery.data?.pagesOpened?.some(
    (page: any) => page.name === "application"
  );
  const isWorkspaceFinished = userQuery.data?.pagesOpened?.some(
    (page: any) => page.name === "workspace"
  );

  // Classes condicionais para cada etapa
  // Se concluída -> fundo verde
  // Se não concluída -> outline (ou outro estilo que preferir)
  const workspaceButtonClasses = isWorkspaceFinished
    ? "bg-green-600 hover:bg-green-700 text-white"
    : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100";

  const inviteMembersButtonClasses = isInviteMembersFinished
    ? "bg-green-600 hover:bg-green-700 text-white"
    : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100";

  const applicationsButtonClasses = isApplicationsFinished
    ? "bg-green-600 hover:bg-green-700 text-white"
    : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100";

  // Podemos também usar a prop `disabled` se quisermos bloquear o botão
  // depois que a etapa foi concluída, mas isso depende do fluxo desejado.
  // Ex.: disabled={isWorkspaceFinished}

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Plataforma</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center h-[88vh] px-4">
        <img
          src="./anuntech-logo.svg"
          width={120}
          height={120}
          alt="Anuntech Logo"
          className="mb-6"
        />

        <h1 className="text-3xl font-bold mb-6 tracking-wide text-gray-800">
          Bem-vindo à Anuntech
        </h1>

        <div className="w-full max-w-md mb-8">
          <p className="text-sm text-gray-600 mb-2">Progresso do Tutorial</p>
          <Progress value={percent} className="h-2" />
          <div className="flex justify-between text-xs mt-2 text-gray-500">
            <span>Etapa {quantity}/3</span>
            <span>{percent}% Concluído</span>
          </div>
        </div>

        <div className="flex flex-col w-full max-w-md gap-6 mt-4">
          <div className="flex flex-col items-center gap-2">
            <Link href={`/settings?workspace=${workspace}`} className="w-full">
              <Button
                size="lg"
                className={`w-full justify-start ${workspaceButtonClasses}`}
              >
                <div className="flex items-center justify-start gap-2">
                  <Briefcase className="w-6 h-6 mr-2" />
                  Adicionar Logo
                </div>

                <CheckCircle
                  className={`ml-auto ${
                    isWorkspaceFinished ? "text-white" : "text-gray-400"
                  }`}
                />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Link
              href={`/settings/members?workspace=${workspace}`}
              className="w-full"
            >
              <Button
                size="lg"
                className={`w-full justify-start ${inviteMembersButtonClasses}`}
              >
                <div className="flex items-center justify-start gap-2">
                  <UserPlus className="w-6 h-6 mr-2" />
                  Convidar Membros
                </div>
                <CheckCircle
                  className={`ml-auto ${
                    isInviteMembersFinished ? "text-white" : "text-gray-400"
                  }`}
                />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Link
              href={`/settings/apps?workspace=${workspace}`}
              className="w-full"
            >
              <Button
                size="lg"
                className={`w-full justify-start ${applicationsButtonClasses}`}
              >
                <div className="flex items-center justify-start gap-2">
                  <PlusSquare className="w-6 h-6 mr-2" />
                  Adicionar Aplicativo
                </div>
                <CheckCircle
                  className={`ml-auto ${
                    isApplicationsFinished ? "text-white" : "text-gray-400"
                  }`}
                />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <Button
            variant="outline"
            className="gap-2 px-6 py-2 text-gray-700 hover:bg-gray-100"
          >
            Pular Tutorial
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  );
}
