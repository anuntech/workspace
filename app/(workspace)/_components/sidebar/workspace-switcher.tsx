"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";

export function WorkspaceSwitcher() {
  const urlParams = useSearchParams();
  const router = useRouter();

  const { isPending, data, isSuccess } = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => api.get("/api/workspace"),
  });
  const selectedWorkspace = urlParams.get("workspace");

  useEffect(() => {
    if (!isSuccess) return;

    const urlWorkspace = urlParams.get("workspace");

    if (!urlWorkspace && data.data.length > 0) {
      const firstWorkspaceId = data.data[0]?.id;
      router.push(`/?workspace=${firstWorkspaceId}`);
      return;
    }
  }, [data]);

  return isPending ? (
    <p>Carregando...</p>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between items-center"
        >
          <div className="flex gap-2">
            <p>
              {data?.data.find(
                (workspace: any) => workspace.id === selectedWorkspace
              )?.icon.type == "emoji" ? (
                data?.data.find(
                  (workspace: any) => workspace.id === selectedWorkspace
                )?.icon.value
              ) : (
                <div className="w-5 h-5 ">
                  <img
                    className="rounded-sm"
                    src={getS3Image(
                      data?.data.find(
                        (workspace: any) => workspace.id === selectedWorkspace
                      )?.icon.value
                    )}
                    alt="@shadcn"
                  />
                </div>
              )}
            </p>
            {
              data?.data.find(
                (workspace: any) => workspace.id === selectedWorkspace
              )?.name
            }
          </div>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[239px]"
        defaultValue={selectedWorkspace}
      >
        {data?.data.map((workspace: any) => (
          <DropdownMenuGroup key={workspace.id} className="w-full">
            <DropdownMenuItem>
              <a href={`/?workspace=${workspace.id}`} className="flex gap-3">
                <p className="w-5 h-5 flex items-center justify-center">
                  {workspace.icon.type == "emoji" ? (
                    workspace.icon.value
                  ) : (
                    <div className="w-5 h-5 flex items-center justify-center">
                      <img
                        className="rounded-sm"
                        src={getS3Image(workspace.icon.value)}
                        alt="@shadcn"
                      />
                    </div>
                  )}
                </p>
                {workspace.name}
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-3"
          onClick={() => router.push("/create-workspace")}
        >
          <Plus className="size-5" />
          Criar workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
