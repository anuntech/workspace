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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconComponent } from "@/components/get-lucide-icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { DropdownApplication } from "./dropdown-application";
import { SidebarApplication } from "./sidebar-application";
import { Plus } from "lucide-react";
import { CreateLinkStepsDialog } from "./links-manager/create-link-steps";

export function NavLinks() {
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");
  const queryClient = useQueryClient();

  const applicationsQuery = useQuery({
    queryKey: ["applications/allow"],
    queryFn: async () => api.get(`/api/applications/${workspace}/allow`),
  });

  const roleQuery = useQuery({
    queryKey: ["workspace/role"],
    queryFn: () =>
      fetch(`/api/workspace/role/${workspace}`).then(async (res) => ({
        data: await res.json(),
        status: res.status,
      })),
  });

  const setPositionsMutation = useMutation({
    mutationFn: async (data: any) =>
      api.post(`/api/applications/${workspace}/set-positions`, data),
    onSuccess: () => {
      applicationsQuery.refetch();
    },
  });

  if (applicationsQuery.isPending) {
    return <Skeleton className="h-7 mx-2" />;
  }

  let enabledApplications = applicationsQuery.data?.data;

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination || source.index === destination.index) {
      return;
    }

    const reorderedApplications = Array.from(enabledApplications);
    const [movedItem] = reorderedApplications.splice(source.index, 1);
    reorderedApplications.splice(destination.index, 0, movedItem);

    queryClient.setQueryData(["applications/allow"], (oldData: any) => {
      if (!oldData) return;
      return {
        ...oldData,
        data: reorderedApplications,
      };
    });

    const data = reorderedApplications.map((app: any, index: number) => ({
      appId: app.id,
      position: index,
    }));

    setPositionsMutation.mutate(data);
  };

  return (
    <>
      <Separator className="mx-2 hidden group-data-[collapsible=icon]:block" />
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center justify-between group-data-[collapsible=icon]:hidden pr-0">
          <p>Links</p>
          <CreateLinkStepsDialog />
        </SidebarGroupLabel>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(provided) => (
              <SidebarMenu ref={provided.innerRef} {...provided.droppableProps}>
                {enabledApplications?.map((data: any, index: number) => (
                  <Draggable
                    key={data.name}
                    draggableId={data.name}
                    index={index}
                    isDragDisabled={
                      roleQuery.data?.data?.role == "member" ||
                      roleQuery.isPending
                    }
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                        }}
                      >
                        <SidebarApplication
                          key={data.name}
                          data={data}
                          workspace={workspace}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </SidebarMenu>
            )}
          </Droppable>
        </DragDropContext>
      </SidebarGroup>
    </>
  );
}
