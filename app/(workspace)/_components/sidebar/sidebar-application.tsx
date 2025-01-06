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
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useSession } from "next-auth/react";
import { DropdownApplication } from "./dropdown-application";

export function SidebarApplication({
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
                  href={`/service/${data.id}?workspace=${workspace}`}
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
                    applicationId={data.id}
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
                  href={`/service/${data.id}?workspace=${workspace}&fieldSubScreen=${field.key}`}
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
                href={`/service/${data.id}?workspace=${workspace}`}
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
                applicationId={data.id}
                className="text-muted-foreground"
              />
            </div>
          </SidebarMenuButton>
        )}
      </Accordion>
    </SidebarMenuItem>
  );
}
