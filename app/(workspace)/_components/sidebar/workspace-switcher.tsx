"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
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

type Workspace = {
  name: string;
  id: string;
  icon: any;
};

export function WorkspaceSwitcher() {
  const urlParams = useSearchParams();
  const router = useRouter();

  const { isPending, data, isSuccess } = useQuery<Workspace[]>({
    queryKey: ["workspace"],
    queryFn: () => fetch("/api/workspace").then((res) => res.json()),
  });

  const selectedWorkspace = urlParams.get("workspace");

  useEffect(() => {
    if (!isSuccess) return;

    const urlWorkspace = urlParams.get("workspace");

    if (!urlWorkspace && data.length > 0) {
      const firstWorkspaceId = data[0]?.id;
      router.push(`/?workspace=${firstWorkspaceId}`);
      return;
    }
  }, [data]);

  return isPending ? (
    <p>Carregando...</p>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <p>
            {
              data?.find((workspace) => workspace.id === selectedWorkspace)
                ?.icon.value
            }
          </p>
          {data?.find((workspace) => workspace.id === selectedWorkspace)?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" defaultValue={selectedWorkspace}>
        {data?.map((workspace) => (
          <DropdownMenuGroup key={workspace.id}>
            <DropdownMenuItem>
              <a href={`/?workspace=${workspace.id}`} className="flex gap-3">
                <p>{workspace.icon.value}</p>
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
