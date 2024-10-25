"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getS3Image } from "@/libs/s3-client";
import { signOut } from "next-auth/react";
import Link from "next/link";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { isPending, data } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground pl-[4px]"
            >
              {data?.icon && (
                <div className="text-[1.3rem]">
                  {data.icon.type == "emoji" ? (
                    data.icon.value
                  ) : (
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={getS3Image(data.icon.value) || "/shad.png"}
                        alt="@shadcn"
                      />
                      <AvatarFallback className="rounded-lg">SC</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}
              {!data?.icon && (
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={data?.image || "/shad.png"} alt="@shadcn" />
                  <AvatarFallback className="rounded-lg">SC</AvatarFallback>
                </Avatar>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{data?.name}</span>
                <span className="truncate text-xs">{data?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {data?.icon && (
                  <div className="text-[1.3rem]">
                    {data.icon.type == "emoji" ? (
                      data.icon.value
                    ) : (
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={getS3Image(data.icon.value) || "/shad.png"}
                          alt="@shadcn"
                        />
                        <AvatarFallback className="rounded-lg">
                          SC
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )}
                {!data?.icon && (
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={data?.image || "/shad.png"}
                      alt="@shadcn"
                    />
                    <AvatarFallback className="rounded-lg">SC</AvatarFallback>
                  </Avatar>
                )}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{data?.name}</span>
                  <span className="truncate text-xs">{data?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/settings/account")}
              >
                <BadgeCheck />
                Perfil
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
