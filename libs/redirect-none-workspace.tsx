"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export function RedirectNoneWorkspace({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();
  const workspacesQuery = useQuery<any[]>({
    queryKey: ["workspace"],
    queryFn: () => fetch("/api/workspace").then((res) => res.json()),
  });

  const router = useRouter();

  const verifyWorkspaceQuantity = () => {
    const count = workspacesQuery?.data?.length;

    if (count === 0) {
      router.push("/create-workspace");
    }
  };

  const verifyIfWorkspaceIsValid = () => {
    if (workspacesQuery.isPending) return;
    const workspaceId = searchParams.get("workspace");

    const isThereWorkspace = workspacesQuery.data?.find(
      (workspace) => workspace.id === workspaceId
    );

    if (workspaceId && !isThereWorkspace) {
      router.push(`/?workspace=${workspacesQuery.data[0].id}`);
    }
  };

  if (!workspacesQuery.isPending && !searchParams.get("workspace")) {
    console.log(workspacesQuery.data);
    router.push(`/?workspace=${workspacesQuery?.data[0]?.id}`);
  }

  verifyWorkspaceQuantity();
  verifyIfWorkspaceIsValid();

  return children;
}
