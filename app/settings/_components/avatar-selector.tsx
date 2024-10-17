"use client";

import { useQuery } from "@tanstack/react-query";
import { AvatarPopover } from "./avatar-popover";
import { useSearchParams } from "next/navigation";
import api from "@/libs/api";

export function AvatarSelector() {
  const workspaceQuery = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => api.get("/api/workspace"),
  });

  const searchParams = useSearchParams();

  if (workspaceQuery.isPending) {
    return <p>Carregando...</p>;
  }

  const workspace = workspaceQuery.data.data.find(
    (workspace: any) => workspace.id === searchParams.get("workspace")
  );
  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-52 h-52 group">
        {workspace.icon ? (
          <div className="w-52 h-52 flex items-center justify-center text-[7rem]">
            {workspace.icon.value}
          </div>
        ) : (
          <div className="bg-zinc-300 w-52 h-52 rounded-[10px] flex items-center justify-center text-[1.5rem]">
            ?
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300">
          <AvatarPopover />
        </div>
      </div>
    </div>
  );
}
