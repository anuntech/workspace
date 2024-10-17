"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api from "./api";

export function RedirectNoneWorkspace({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();
  const workspacesQuery = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => api.get("/api/workspace"),
  });

  const router = useRouter();

  const verifyWorkspaceQuantity = () => {
    const count = workspacesQuery?.data?.data.length;

    if (count === 0) {
      router.push("/create-workspace");
    }
  };

  const verifyIfWorkspaceIsValid = () => {
    if (workspacesQuery.isPending) return;
    const workspaceId = searchParams.get("workspace");

    const isThereWorkspace = workspacesQuery.data?.data.find(
      (workspace: any) => workspace.id === workspaceId
    );

    if (workspaceId && !isThereWorkspace) {
      router.push(`/?workspace=${workspacesQuery.data.data[0].id}`);
    }
  };

  if (!workspacesQuery.isPending && !searchParams.get("workspace")) {
    console.log(workspacesQuery.data);
    router.push(`/?workspace=${workspacesQuery?.data.data[0]?.id}`);
  }

  verifyWorkspaceQuantity();
  verifyIfWorkspaceIsValid();

  return children;
}
