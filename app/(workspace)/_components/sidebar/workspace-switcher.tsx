"use client";

import { useEffect, useState } from "react";
import { Apple, Plus, Triangle, Turtle } from "lucide-react";
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
import { workspaceIcons } from "@/libs/icons";

type Workspace = {
  label: string;
  id: string;
  icon: any;
};

export function WorkspaceSwitcher() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const urlParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const res = async () => {
      const data = await fetch("/api/workspace");
      const json = await data.json();
      setWorkspaces(
        json.map((workspace: any) => ({
          ...workspace,
          icon: (workspaceIcons as any)[workspace.icon],
          label: workspace.name,
        }))
      );

      if (!urlParams.get("workspace")) {
        router.push(`/?workspace=${json[0]?.id}`);
      }

      handleWorkspaceChange(urlParams.get("workspace"));
    };

    res();
  }, [workspaces]);

  const [selectedWorkspace, setSelectedWorkspace] = useState<string>(
    workspaces[0]?.id || ""
  );

  function handleWorkspaceChange(id: string) {
    setSelectedWorkspace(id);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          {
            workspaces.find((workspace) => workspace.id === selectedWorkspace)
              ?.icon
          }
          {
            workspaces.find((workspace) => workspace.id === selectedWorkspace)
              ?.label
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        {workspaces.map((workspace) => (
          <DropdownMenuGroup key={workspace.id}>
            <DropdownMenuItem
              className="gap-3"
              onClick={() => handleWorkspaceChange(workspace.id)}
            >
              {workspace.icon}
              {workspace.label}
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
