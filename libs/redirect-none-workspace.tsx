"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api from "./api";

export function RedirectNoneWorkspace({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Query for workspaces
  const workspacesQuery = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => api.get("/api/workspace"),
  });

  useEffect(() => {
    if (workspacesQuery.isPending || !workspacesQuery.data) return;

    const count = workspacesQuery?.data?.data.length;

    // Redirect to create-workspace if no workspace exists
    if (count === 0) {
      router.push("/create-workspace");
      return;
    }

    const workspaceId = searchParams.get("workspace");

    // Check if the workspace is valid, if not, redirect to the first workspace
    const isThereWorkspace = workspacesQuery.data?.data.find(
      (workspace: any) => workspace.id === workspaceId
    );

    if (workspaceId && !isThereWorkspace) {
      router.push(`/?workspace=${workspacesQuery.data.data[0].id}`);
      return;
    }

    // If no workspace is selected, redirect to the first one
    if (!workspaceId) {
      router.push(`/?workspace=${workspacesQuery?.data.data[0]?.id}`);
    }
  }, [searchParams, workspacesQuery.data, workspacesQuery.isPending, router]);

  return children;
}
