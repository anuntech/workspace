"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
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

export function NavProjects() {
  const { isMobile } = useSidebar();
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");
  const router = useRouter();

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => api.get(`/api/applications/${workspace}`),
  });

  if (applicationsQuery.isPending) {
    return <Skeleton className="h-7 mx-2" />;
  }

  let enabledApplications;

  if (applicationsQuery?.data?.data && applicationsQuery.data.status === 200) {
    enabledApplications = applicationsQuery.data.data?.filter(
      (app: any) => app.status === "enabled"
    );
  }

  return (
    <>
      {enabledApplications.length > 0 && (
        <Separator className="mx-2 hidden group-data-[collapsible=icon]:block" />
      )}
      <SidebarGroup>
        {enabledApplications.length > 0 && (
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Aplicativos
          </SidebarGroupLabel>
        )}
        <SidebarMenu>
          {enabledApplications.map((data: any) => (
            <SidebarMenuItem key={data.name}>
              <Accordion type="multiple">
                {data.fields.length > 0 ? (
                  <AccordionItem value="item-1" className="border-none">
                    <SidebarMenuButton
                      className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
                      tooltip={data.name}
                    >
                      <AccordionTrigger
                        className={cn(`absolute p-0 top-2 right-2`)}
                      ></AccordionTrigger>
                      {data.icon?.type == "emoji" && (
                        <p
                          className={cn(`size-5 pointer-events-none ml-[-8px]`)}
                        >
                          {data.icon.value}
                        </p>
                      )}
                      {(data.icon?.type == "image" || !data.icon) && (
                        <Avatar className="size-5">
                          <AvatarImage
                            src={getS3Image(data.icon?.value || data.avatarSrc)}
                          />
                          <AvatarFallback>{data.avatarFallback}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <Link
                          href={`/service/${data._id}?workspace=${workspace}`}
                          passHref
                          className="flex items-center"
                        >
                          <span className="">{data.name}</span>
                        </Link>
                      </div>
                    </SidebarMenuButton>
                    <AccordionContent className="pb-0">
                      {data.fields.map((field: any) => (
                        <Link
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
                  >
                    <Link
                      href={`/service/${data._id}?workspace=${workspace}`}
                      passHref
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center">
                        {data.icon?.type == "emoji" && (
                          <p className="size-5">{data.icon.value}</p>
                        )}
                        {(data.icon?.type == "image" || !data.icon) && (
                          <Avatar className="size-5">
                            <AvatarImage
                              src={getS3Image(
                                data.icon?.value || data.avatarSrc
                              )}
                            />
                            <AvatarFallback>
                              {data.avatarFallback}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className="ml-2">{data.name}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                )}
              </Accordion>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
