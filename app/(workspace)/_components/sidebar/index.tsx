"use client";

import { WorkspaceSwitcher } from "./workspace-switcher";
import { House, Rocket, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserNav } from "./user-nav";
import { NavLink } from "./nav-link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export function Sidebar() {
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");

  const roleQuery = useQuery({
    queryKey: ["workspace/role"],
    queryFn: () =>
      fetch(`/api/workspace/role/${workspace}`).then((res) => res.json()),
  });

  return (
    <aside className="flex flex-col gap-3 rounded-md px-2">
      <section className="flex items-center justify-center">
        <WorkspaceSwitcher />
      </section>
      <Separator />
      <nav className="flex flex-1 flex-col gap-1">
        <NavLink href="/">
          <House className="mr-3 size-5" />
          Home
        </NavLink>

        {roleQuery.data?.role !== "member" && !roleQuery.isPending && (
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
