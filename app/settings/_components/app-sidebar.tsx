"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import config from "@/config";
import api from "@/libs/api";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace") || "";

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  const createPortalMutation = useMutation({
    mutationFn: async () =>
      await api.post("/api/stripe/create-portal", {
        returnUrl: window.location.href,
        customerId: userQuery.data?.customerId,
      }),
    onSuccess: ({ data }) => {
      window.location.href = data.url;
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Erro ao acessar a fatura",
        description: (err.response.data as any)?.error,
        variant: "destructive",
      });
    },
  });

  const emailDomain = userQuery.data?.email?.split("@")[1];

  return (
    <Sidebar
      {...props}
      className="bg-[#F4F4F5] border-none" // Add your custom background color here
      defaultChecked={true}
    >
      <SidebarHeader>
        <SearchForm className="mt-6" />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create Link collapsible SidebarGroup for each parent. */}
        <Collapsible
          title="Workspace"
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                Workspace{" "}
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent className="font-normal">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                      asChild
                    >
                      <Link href={`/settings?workspace=${workspace}`}>
                        Visão geral
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                      asChild
                    >
                      <Link href={`/settings/apps?workspace=${workspace}`}>
                        Loja de aplicativos
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                      asChild
                    >
                      <Link href={`/settings/members?workspace=${workspace}`}>
                        Membros
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                      asChild
                    >
                      <Link href={`/settings/plans?workspace=${workspace}`}>
                        Planos
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                      onClick={() => createPortalMutation.mutate()}
                    >
                      Faturas
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible
          title="Workspace"
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                Minha conta{" "}
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent className="font-normal">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                      asChild
                    >
                      <Link href={`/settings/account?workspace=${workspace}`}>
                        Meu perfil
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                      asChild
                    >
                      <Link
                        href={`/settings/account/workspaces?workspace=${workspace}`}
                      >
                        Workspaces
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {emailDomain == config.domainName && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                        asChild
                      >
                        <Link
                          href={`/settings/account/apps-admin?workspace=${workspace}`}
                        >
                          Administração de aplicativos
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
              >
                <Link href={`/?workspace=${workspace}`}>
                  <ChevronLeft className="size-4" />
                  Voltar
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  );
}
