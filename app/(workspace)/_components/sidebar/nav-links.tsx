"use client";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
} from "@/components/ui/sidebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { SidebarApplication } from "./sidebar-application";
import { CreateLinkStepsDialog } from "./links-manager/create-link-steps";
import { Separator } from "@radix-ui/react-separator";

export function NavLinks() {
	const urlParams = useSearchParams();
	const workspace = urlParams.get("workspace");
	const queryClient = useQueryClient();

	const linksQuery = useQuery({
		queryKey: ["workspace/links"],
		queryFn: async () =>
			api.get(`/api/workspace/link?workspaceId=${workspace}`),
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
			api.post(`/api/workspace/link/${workspace}/set-positions`, data),
		onSuccess: () => {
			linksQuery.refetch();
		},
	});

	if (linksQuery.isPending) {
		return <Skeleton className="h-7 mx-2" />;
	}

	let links = linksQuery.data?.data?.links;

	const onDragEnd = (result: any) => {
		const { source, destination } = result;

		if (!destination || source.index === destination.index) {
			return;
		}

		const reorderedLinks = Array.from(links);
		const [movedItem] = reorderedLinks.splice(source.index, 1);
		reorderedLinks.splice(destination.index, 0, movedItem);

		queryClient.setQueryData(["workspace/links"], (oldData: any) => {
			if (!oldData) return;
			return {
				...oldData,
				data: { links: reorderedLinks },
			};
		});

		const data = reorderedLinks.map((link: any, index: number) => ({
			linkId: link.id,
			position: index,
		}));

		setPositionsMutation.mutate(data);
	};

	return (
		<>
			{links?.length > 0 && (
				<Separator className="mx-2 hidden group-data-[collapsible=icon]:block" />
			)}
			<SidebarGroup>
				<SidebarGroupLabel className="flex items-center justify-between group-data-[collapsible=icon]:hidden pr-0">
					<p>Links</p>
					<CreateLinkStepsDialog />
				</SidebarGroupLabel>
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId="droppable" direction="vertical">
						{(provided) => (
							<SidebarMenu ref={provided.innerRef} {...provided.droppableProps}>
								{links?.map((data: any, index: number) => (
									<Draggable
										key={data.title}
										draggableId={data.title}
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
													isLink
													key={data.title}
													data={{
														...data,
														name: data.title,
														applicationUrl: data.url,
														applicationUrlType: data.urlType,
													}}
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
