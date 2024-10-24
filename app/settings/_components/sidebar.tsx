"use client";

import Link from "next/link";
import { Building, ChevronLeft, CircleUser } from "lucide-react";
import { NavLink } from "@/app/(workspace)/_components/sidebar/nav-link";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import config from "@/config";

export function Sidebar() {
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace") || "";

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  if (userQuery.isPending) {
    return (
      <div className="space-y-2 mx-3 h-full flex flex-col">
        <Link
          href={`/?workspace=${workspace}`}
          className="flex w-max items-center gap-2"
        >
          <ChevronLeft className="size-4" />
          Voltar
        </Link>
        <Separator />

        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <div className="flex-grow mt-auto flex flex-col justify-end gap-2">
          <Skeleton className="h-9" />
          <Separator />
          <Skeleton className="h-9" />
        </div>
      </div>
    );
  }

  const emailDomain = userQuery.data?.email?.split("@")[1];

  return (
    <aside className="flex flex-col gap-4 rounded-md px-2">
      <Link
        href={`/?workspace=${workspace}`}
        className="flex w-max items-center gap-2"
      >
        <ChevronLeft className="size-4" />
        Voltar
      </Link>
      <Separator />
      <nav className="space-y-5">
        {workspace != "" && (
          <div className="space-y-2">
            <span className="flex items-center gap-2 text-sm text-zinc-600">
              <Building className="size-4" />
              Workspace
            </span>
            <ul className="space-y-1 text-sm">
              <li>
                <NavLink href={`/settings?workspace=${workspace}`}>
                  Visão geral
                </NavLink>
              </li>
              <li>
                <NavLink href={`/settings/apps?workspace=${workspace}`}>
                  Loja de aplicativos
                </NavLink>
              </li>
              <li>
                <NavLink href={`/settings/members?workspace=${workspace}`}>
                  Membros
                </NavLink>
              </li>
              {/* <li>
              <NavLink href="/settings/roles">Cargos</NavLink>
            </li> */}
              <li>
                <NavLink href={`/settings/plans?workspace=${workspace}`}>
                  Planos
                </NavLink>
              </li>
              <li>
                <NavLink href="https://billing.stripe.com/p/login/test_00gg2ObKK5nm0lq8ww">
                  Faturas
                </NavLink>
              </li>
            </ul>
          </div>
        )}
        <div className="space-y-2">
          <span className="flex items-center gap-2 text-sm text-zinc-600">
            <CircleUser className="size-4" />
            Minha conta
          </span>
          <ul className="space-y-1 text-sm">
            <li>
              <NavLink href={`/settings/account?workspace=${workspace}`}>
                Meu perfil
              </NavLink>
            </li>
            <li>
              <NavLink
                href={`/settings/account/workspaces?workspace=${workspace}`}
              >
                Workspaces
              </NavLink>
            </li>
            <li>
              {emailDomain == config.domainName && (
                <NavLink
                  href={`/settings/account/apps-admin?workspace=${workspace}`}
                >
                  Administração de aplicativos
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
