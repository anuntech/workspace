"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "../../../../components/ui/skeleton";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { getS3Image } from "@/libs/s3-client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconComponent } from "@/components/get-lucide-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, MoreHorizontal } from "lucide-react";

export function NavFavorites() {
  const { isMobile } = useSidebar();
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");
  const router = useRouter();

  const applicationsQuery = useQuery({
    queryKey: ["applications/favorite"],
    queryFn: async () =>
      api.get(`/api/applications/favorite?workspaceId=${workspace}`),
  });

  if (applicationsQuery.isPending) {
    return <Skeleton className="h-7 mx-2" />;
  }

  let enabledApplications;

  if (applicationsQuery?.data?.data && applicationsQuery.data.status === 200) {
    enabledApplications = applicationsQuery.data.data?.favorites.map(
      (a: any) => a.applicationId
    );
  }

  return (
    <>
      {enabledApplications?.length > 0 && (
        <Separator className="mx-2 hidden group-data-[collapsible=icon]:block" />
      )}
      <SidebarGroup>
        {enabledApplications?.length > 0 && (
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Favoritos
          </SidebarGroupLabel>
        )}
        <SidebarMenu>
          {enabledApplications?.map((data: any) => (
            <SidebarApplication
              key={data.name}
              data={data}
              workspace={workspace}
            />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}

function SidebarApplication({
  data,
  workspace,
}: {
  data: any;
  workspace: string | null;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  return (
    <SidebarMenuItem>
      <Accordion type="multiple">
        {data.fields.length > 0 ? (
          <AccordionItem value="item-1" className="border-none">
            <SidebarMenuButton
              asChild
              className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
              tooltip={data.name}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="flex items-center justify-between w-full">
                <Link
                  href={`/service/${data._id}?workspace=${workspace}`}
                  passHref
                  className="flex items-center"
                >
                  <div className="flex w-5 items-center justify-center">
                    {data.icon?.type === "emoji" && (
                      <p className=" pointer-events-none">{data.icon.value}</p>
                    )}
                    {data.icon?.type === "lucide" && (
                      <IconComponent
                        className="size-5 pointer-events-none"
                        name={data.icon.value}
                      />
                    )}
                    {(data.icon?.type === "image" || !data.icon) && (
                      <Avatar className="size-5">
                        <AvatarImage
                          src={getS3Image(data.icon?.value || data.avatarSrc)}
                        />
                        <AvatarFallback>{data.avatarFallback}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <span className="ml-3">{data.name}</span>
                </Link>

                <div className="flex items-center gap-2">
                  <DropdownApplication
                    isHover={isHovering}
                    applicationId={data._id}
                    className="text-muted-foreground"
                  />
                  <AccordionTrigger />
                </div>
              </div>
            </SidebarMenuButton>

            <AccordionContent className="pb-0">
              {data.fields.map((field: any) => (
                <Link
                  key={field.key}
                  href={`/service/${data._id}?workspace=${workspace}&fieldSubScreen=${field.key}`}
                >
                  <Button
                    id={field.key}
                    variant="ghost"
                    className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150 w-full justify-start pl-10 relative before:content-['•'] before:absolute before:left-6 before:text-gray-500 h-4 py-4"
                  >
                    {field.key}
                  </Button>
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        ) : (
          <SidebarMenuButton
            asChild
            className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
            tooltip={data.name}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div
              className="flex items-center justify-between w-full"
              ref={buttonRef}
            >
              <Link
                href={`/service/${data._id}?workspace=${workspace}`}
                passHref
                className="flex items-center"
              >
                <div className="flex w-5 items-center justify-center">
                  {data.icon?.type === "emoji" && (
                    <p className=" pointer-events-none">{data.icon.value}</p>
                  )}
                  {data.icon?.type === "lucide" && (
                    <IconComponent
                      className="size-5 pointer-events-none"
                      name={data.icon.value}
                    />
                  )}
                  {(data.icon?.type === "image" || !data.icon) && (
                    <Avatar className="size-5">
                      <AvatarImage
                        src={getS3Image(data.icon?.value || data.avatarSrc)}
                      />
                      <AvatarFallback>{data.avatarFallback}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <span className="ml-3">{data.name}</span>
              </Link>

              <DropdownApplication
                isHover={isHovering}
                applicationId={data._id}
                className="text-muted-foreground"
              />
            </div>
          </SidebarMenuButton>
        )}
      </Accordion>
    </SidebarMenuItem>
  );
}

export function DropdownApplication({
  isHover,
  applicationId,
  className,
}: {
  isHover?: boolean;
  applicationId: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");
  const queryClient = useQueryClient();

  const changeFavoriteMutation = useMutation({
    mutationFn: async () =>
      api.post(`/api/applications/favorite`, {
        applicationId,
        workspaceId: workspace,
      }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["applications/favorite"],
        type: "all",
      });
    },
  });

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) setIsOpen(true);
        setTimeout(() => {
          setIsOpen(open);
        }, 100);
      }}
    >
      <DropdownMenuTrigger asChild className={className}>
        <button className={!isHover && !isOpen && "hidden"}>
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => changeFavoriteMutation.mutate()}>
            <Heart />
            Remover dos favoritos
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
