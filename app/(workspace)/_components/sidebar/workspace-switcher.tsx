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
import { getWorkspaceIcon } from "@/libs/icons";
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

  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");

  useEffect(() => {
    if (!isSuccess) return;
    if (!data) return;

    const urlWorkspace = urlParams.get("workspace");

    if (!urlWorkspace && data.length > 0) {
      const firstWorkspaceId = data[0]?.id;
      setSelectedWorkspace(firstWorkspaceId);
      router.push(`/?workspace=${firstWorkspaceId}`);
      return;
    }

    setSelectedWorkspace(urlWorkspace);
  }, [data]);

  const handleSelectWorkspace = (workspaceId: string) => {
    router.push(`/?workspace=${workspaceId}`);
    window.location.reload();
  };

  return isPending ? (
    <p>Carregando...</p>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          {getWorkspaceIcon(
            data?.find((workspace) => workspace.id === selectedWorkspace)?.icon
          )}
          {data?.find((workspace) => workspace.id === selectedWorkspace)?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        {data?.map((workspace) => (
          <DropdownMenuGroup key={workspace.id}>
            <DropdownMenuItem
              className="gap-3"
              onClick={() => handleSelectWorkspace(workspace.id)}
            >
              {getWorkspaceIcon(workspace.icon)}
              {workspace.name}
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
