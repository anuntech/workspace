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
import { useSession } from "next-auth/react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
} from "react-beautiful-dnd";

export function NavProjects() {
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");
  const queryClient = useQueryClient();

  const [localApplications, setLocalApplications] = useState<any[]>([]);

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => api.get(`/api/applications/${workspace}`),
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

  let enabledApplications: any;

  if (applicationsQuery?.data?.data && applicationsQuery.data.status === 200) {
    enabledApplications = applicationsQuery.data.data?.filter(
      (app: any) => app.status === "enabled"
    );
  }

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination || source.index === destination.index) {
      return;
    }

    const reorderedApplications = Array.from(enabledApplications);
    const [movedItem] = reorderedApplications.splice(source.index, 1);
    reorderedApplications.splice(destination.index, 0, movedItem);

    queryClient.setQueryData(["applications"], (oldData: any) => {
      if (!oldData) return;
      return {
        ...oldData,
        data: reorderedApplications,
      };
    });

    const data = reorderedApplications.map((app: any, index: number) => ({
      appId: app._id,
      position: index,
    }));

    setPositionsMutation.mutate(data);
  };

  return (
    <>
      {enabledApplications?.length > 0 && (
        <Separator className="mx-2 hidden group-data-[collapsible=icon]:block" />
      )}
      <SidebarGroup>
        {enabledApplications?.length > 0 && (
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Aplicativos
          </SidebarGroupLabel>
        )}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(provided) => (
              <SidebarMenu ref={provided.innerRef} {...provided.droppableProps}>
                {enabledApplications?.map((data: any, index: number) => (
                  <Draggable
                    key={data.name}
                    draggableId={data.name}
                    index={index}
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
                          provided={provided}
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

function SidebarApplication({
  data,
  workspace,
  provided,
}: {
  data: any;
  workspace: string | null;
  provided: DraggableProvided;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  return (
    <SidebarMenuItem>
      <Accordion type="multiple">
        {data.fields.length > 0 ? (
          <AccordionItem
            value="item-1"
            className="border-none"
            ref={provided.innerRef}
          >
            <SidebarMenuButton
              className="hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
              tooltip={data.name}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              asChild
            >
              <div className="relative w-full">
                <AccordionTrigger
                  className={cn(`absolute p-0 top-[0.47rem] right-2`)}
                ></AccordionTrigger>
                {data.icon?.type == "emoji" && (
                  <p className={cn(`size-5 pointer-events-none ml-[-8px]`)}>
                    {data.icon.value}
                  </p>
                )}

                {data.icon?.type == "lucide" && (
                  <p className={cn(`size-5 pointer-events-none ml-[-8px]`)}>
                    <IconComponent className="size-5" name={data.icon?.value} />
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
                <DropdownApplication
                  isHover={isHovering}
                  applicationId={data._id}
                  className="ml-11 text-muted-foreground"
                />
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
          >
            <div
              ref={buttonRef}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="flex items-center justify-between w-full"
            >
              <Link
                href={`/service/${data._id}?workspace=${workspace}`}
                passHref
                className="flex items-center"
              >
                <div className="flex items-center">
                  {data.icon?.type == "emoji" && (
                    <p className="size-5">{data.icon.value}</p>
                  )}
                  {data.icon?.type == "lucide" && (
                    <IconComponent className="size-5" name={data.icon?.value} />
                  )}
                  {(data.icon?.type == "image" || !data.icon) && (
                    <Avatar className="size-5">
                      <AvatarImage
                        src={getS3Image(data.icon?.value || data.avatarSrc)}
                      />
                      <AvatarFallback>{data.avatarFallback}</AvatarFallback>
                    </Avatar>
                  )}
                  <span className="ml-2">{data.name}</span>
                </div>
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
  const session = useSession();

  const applicationsQuery = useQuery({
    queryKey: ["applications/favorite"],
    queryFn: async () =>
      api.get(`/api/applications/favorite?workspaceId=${workspace}`),
  });

  const isThisAnFavoriteApp = applicationsQuery.data?.data.favorites.some(
    (a: any) =>
      a.userId == session.data?.user?.id && a.applicationId.id == applicationId
  );

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
          <MoreHorizontal className="size-4 " />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => changeFavoriteMutation.mutate()}>
            <Heart />
            {isThisAnFavoriteApp ? "Remover dos" : "Adicionar aos"} favoritos
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
