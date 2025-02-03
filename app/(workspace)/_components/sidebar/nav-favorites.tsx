"use client";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
} from "@/components/ui/sidebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useSession } from "next-auth/react";
import { SidebarApplication } from "./sidebar-application";

export function NavFavorites() {
	const urlParams = useSearchParams();
	const workspace = urlParams.get("workspace");
	const queryClient = useQueryClient();
	const session = useSession();

	const applicationsQuery = useQuery({
		queryKey: ["/favorite"],
		queryFn: async () => api.get(`/api/favorite?workspaceId=${workspace}`),
	});

	const setPositionsMutation = useMutation({
		mutationFn: async (data: any) =>
			api.post(`/api/favorite/set-positions`, {
				data,
				workspaceId: workspace,
			}),
	});

	if (applicationsQuery.isPending) {
		return <Skeleton className="h-7 mx-2" />;
	}

	let enabledApplications: any;

	if (applicationsQuery?.data?.data && applicationsQuery.data.status === 200) {
		enabledApplications = applicationsQuery.data.data?.favorites.map(
			(a: any) => a.applicationId,
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

		queryClient.setQueryData(["/favorite"], (oldData: any) => {
			if (!oldData) return;
			return {
				...oldData,
				data: {
					favorites: reorderedApplications.map((a: any) => ({
						applicationId: { ...a },
						userId: session.data?.user?.id,
					})),
				},
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
			{enabledApplications?.length > 0 && (
				<Separator className="mx-2 hidden group-data-[collapsible=icon]:block" />
			)}
			<SidebarGroup>
				{enabledApplications?.length > 0 && (
					<SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
						Favoritos
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
													isLink={data.type === "link"}
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
