"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api from "./api";

export function RedirectIsMember({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const searchParams = useSearchParams();
	const workspaceId = searchParams.get("workspace");
	const router = useRouter();

	// Query for workspaces
	const workspacesQuery = useQuery({
		queryKey: ["workspace"],
		queryFn: async () => api.get("/api/workspace"),
	});

	const userQuery = useQuery({
		queryKey: ["user"],
		queryFn: () => fetch("/api/user").then((res) => res.json()),
	});

	if (!workspacesQuery.isPending && !userQuery.isPending && workspaceId) {
		const selectedWorkspace = workspacesQuery.data.data.find(
			(w: any) => w.id === workspaceId,
		);

		if (selectedWorkspace) {
			const isMember =
				selectedWorkspace.members.find(
					(w: any) => w.memberId === userQuery?.data?._id,
				)?.role == "member";

			if (isMember) router.push(`/?workspace=${workspaceId}`);
		}
	}

	return children;
}
