"use client";

import { WorkspaceSwitcher } from "./workspace-switcher";
import { House, Rocket, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserNav } from "./user-nav";
import { NavLink } from "./nav-link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";

export function Sidebar() {
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");
  const router = useRouter();

  const roleQuery = useQuery({
    queryKey: ["workspace/role"],
    queryFn: () =>
      fetch(`/api/workspace/role/${workspace}`).then(async (res) => ({
        data: await res.json(),
        status: res.status,
      })),
  });

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => api.get(`/api/applications/${workspace}`),
  });

  const data = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => api.get("/api/workspace"),
  });

  if (roleQuery.isPending || applicationsQuery.isPending || data.isPending) {
    return (
      <div className="space-y-2 mx-3 h-full flex flex-col">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <div className="flex-grow mt-auto flex flex-col justify-end gap-2">
          <Skeleton className="h-10" />
          <Separator />
          <Skeleton className="h-10" />
        </div>
      </div>
    );
  }

  if (!workspace) {
    router.push(`/?workspace=${data.data.data[0].id}`);
    return;
  }

  let enabledApplications;

  if (applicationsQuery?.data?.data && applicationsQuery.data.status === 200) {
    enabledApplications = applicationsQuery.data.data?.filter(
      (app: any) => app.status === "enabled"
    );
  }

  return (
    <aside className="flex flex-col gap-3 rounded-md px-2">
      <section className="flex items-center justify-center">
        <WorkspaceSwitcher />
      </section>
      <Separator />
      <nav className="flex flex-1 flex-col gap-1">
        <NavLink href={`/?workspace=${workspace}`}>
          <House className="mr-3 size-5" />
          Home
        </NavLink>
        {enabledApplications?.map((data: any) => (
          <NavLink href={`/service/${data._id}?workspace=${workspace}`}>
            <Avatar className="mr-3 size-5">
              <AvatarImage src={getS3Image(data.avatarSrc)} />
              <AvatarFallback>{data.avatarFallback}</AvatarFallback>
            </Avatar>
            {data.name}
          </NavLink>
        ))}
        {roleQuery.data?.data?.role !== "member" && !roleQuery.isPending && (
          <NavLink href={`/settings?workspace=${workspace}`}>
            <Settings className="mr-3 size-5" />
            Configurações
          </NavLink>
        )}
        <div className="mt-auto">
          <NavLink href={`/settings/plans?workspace=${workspace}`}>
            <Rocket className="mr-3 size-5" />
            Fazer upgrade
          </NavLink>
        </div>
      </nav>
      <Separator />
      <section className="flex items-center">
        <UserNav />
      </section>
    </aside>
  );
}
