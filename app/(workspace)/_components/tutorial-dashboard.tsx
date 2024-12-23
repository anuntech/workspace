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
import api from "@/libs/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  PlusSquare,
  UserPlus,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function TutorialDashboard() {
  const workspace = useSearchParams().get("workspace");

  const workspaceQuery = useQuery({
    queryKey: ["find-workspace"],
    queryFn: () =>
      api.get(`/api/workspace/${workspace}`).then((res) => res.data),
  });

  const isInviteMembersFinished = workspaceQuery.data?.tutorial?.some(
    (page: any) => page.name === "invitation"
  );
  const isApplicationsFinished = workspaceQuery.data?.tutorial?.some(
    (page: any) => page.name === "application"
  );
  const isWorkspaceFinished = workspaceQuery.data?.tutorial?.some(
    (page: any) => page.name === "workspace"
  );

  const workspaceButtonClasses = isWorkspaceFinished
    ? "bg-gray-800 hover:bg-gray-700 text-white"
    : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100";

  const inviteMembersButtonClasses = isInviteMembersFinished
    ? "bg-gray-800 hover:bg-gray-700 text-white"
    : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100";

  const applicationsButtonClasses = isApplicationsFinished
    ? "bg-gray-800 hover:bg-gray-700 text-white"
    : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100";

  const changeTutorialMutation = useMutation({
    mutationFn: async () => {
      await api.post("/api/workspace/tutorial", {
        pageOpened: "workspace",
        workspaceId: workspace,
      });

      await api.post("/api/workspace/tutorial", {
        pageOpened: "invitation",
        workspaceId: workspace,
      });

      await api.post("/api/workspace/tutorial", {
        pageOpened: "application",
        workspaceId: workspace,
      });
    },
    onSuccess: async () => {
      await workspaceQuery.refetch();
    },
  });

  const handleSkipTutorial = () => {
    if (
      workspaceQuery.isFetched &&
      !workspaceQuery.data?.tutorial?.includes("workspace")
    ) {
      changeTutorialMutation.mutate();
    }
  };

  const router = useRouter();

  const quantity = workspaceQuery.data?.tutorial
    ? workspaceQuery.data?.tutorial.length
    : 0;
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

  return (
    <div className="flex flex-col items-center justify-center h-[88vh] px-4">
      <img
        src="./anuntech-icon-black.png"
        width={200}
        height={200}
        alt="Anuntech Logo"
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
          <Button
            size="lg"
            className={`w-full justify-start ${workspaceButtonClasses}`}
            onClick={() => router.push(`/settings?workspace=${workspace}`)}
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
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button
            size="lg"
            className={`w-full justify-start ${inviteMembersButtonClasses}`}
            onClick={() =>
              router.push(`/settings/members?workspace=${workspace}`)
            }
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
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button
            size="lg"
            className={`w-full justify-start ${applicationsButtonClasses}`}
            onClick={() => router.push(`/settings/apps?workspace=${workspace}`)}
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
        </div>
      </div>

      <div className="mt-10">
        <Button
          variant="outline"
          className="gap-2 px-6 py-2 text-gray-700 hover:bg-gray-100"
          onClick={handleSkipTutorial}
          disabled={
            changeTutorialMutation.isPending ||
            quantity == 3 ||
            workspaceQuery.isPending
          }
        >
          Pular Tutorial
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
