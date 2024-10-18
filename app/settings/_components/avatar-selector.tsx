"use client";

import { useQuery } from "@tanstack/react-query";
import { AvatarPopover } from "./avatar-popover";
import { useSearchParams } from "next/navigation";
import api from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";
import { Skeleton } from "@/components/ui/skeleton";

export function AvatarSelector() {
  const workspaceQuery = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => api.get("/api/workspace"),
  });

  const searchParams = useSearchParams();

  if (workspaceQuery.isPending) {
    return <Skeleton className="w-52 h-52" />;
  }

  const workspace = workspaceQuery.data.data.find(
    (workspace: any) => workspace.id === searchParams.get("workspace")
  );
  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-52 h-52 group flex items-center justify-center">
        {workspace.icon.type == "emoji" ? (
          <div className="w-52 h-52 flex items-center justify-center text-[7rem]">
            {workspace.icon.value}
          </div>
        ) : (
          <img src={getS3Image(workspace.icon.value)} alt="" />
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300">
          <AvatarPopover />
        </div>
      </div>
    </div>
  );
}
