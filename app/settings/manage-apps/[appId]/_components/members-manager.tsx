"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import api from "@/libs/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getS3Image } from "@/libs/s3-client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { UserSearchInput } from "@/components/user-search-input";
import { IUser } from "@/models/User";

export function MembersManager({ params }: { params: { appId: string } }) {
	const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
	const searchParams = useSearchParams();
	const workspace = searchParams.get("workspace");

	const appMembersMutation = useMutation({
		mutationFn: (data: { workspaceId: string; memberId: string }) =>
			api.post(`/api/workspace/rules/members`, {
				workspaceId: data.workspaceId,
				memberId: data.memberId,
				appId: params.appId,
			}),
		onError: (error) => {
			console.error("Erro ao adicionar membro:", error);
		},
		onSuccess: () => {
			queryClient.refetchQueries({
				queryKey: ["appMembers"],
				type: "active",
			});
			setSelectedUsers([]);
		},
	});

	const appMembersQuery = useQuery({
		queryKey: ["appMembers"],
		queryFn: async () => {
			const res = await api.get(
				`/api/workspace/rules/members/${workspace}?appId=${params.appId}`,
			);
			return res;
		},
	});

	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: (data: { userId: string }) =>
			api.delete(
				`/api/workspace/rules/members/${workspace}/${data.userId}/${params.appId}`,
			),
		onSuccess: () => {
			queryClient.refetchQueries({
				queryKey: ["appMembers"],
				type: "active",
			});
		},
	});

	const handleAddMembers = async () => {
		appMembersMutation.mutate({
			memberId: selectedUsers[0]._id,
			workspaceId: workspace,
		});
	};

	const handleDeleteMember = async (id: string) => {
		deleteMutation.mutate({
			userId: id,
		});
	};

	const members = appMembersQuery.data?.data?.find((ap: any) => ap.appId);
	return (
		<div className="space-y-5">
			<section>
				<h2 className="text-lg font-bold">
					Adicionar membros para um aplicativo
				</h2>
				<span className="text-sm text-zinc-500">
					Adicione os membros da sua equipe para terem acesso a esse app.
				</span>
			</section>
			<section>
				<div className="flex gap-2 items-center">
					<UserSearchInput
						selectedUsers={selectedUsers}
						setSelectedUsers={setSelectedUsers}
						workspaceId={workspace}
						excludedUsers={members?.members}
					/>
					<Button
						onClick={() => handleAddMembers()}
						className="h-full"
						disabled={
							selectedUsers.length < 1 ||
							deleteMutation.isPending ||
							appMembersQuery.isPending ||
							appMembersMutation.isPending
						}
					>
						Adicionar
					</Button>
				</div>
				<div className="mt-7">
					{members?.members.map((member: any) => (
						<div
							key={member._id}
							className="flex items-center justify-between space-x-4 hover:bg-gray-100 p-4 rounded-lg"
						>
							<div className="flex items-center space-x-4">
								{member.icon && (
									<div className="text-[1.3rem]">
										{member.icon.type == "emoji" ? (
											member.icon.value
										) : (
											<Image
												className="rounded-full"
												width={54}
												height={54}
												src={getS3Image(member.icon.value)}
												alt=""
											/>
										)}
									</div>
								)}
								{!member.icon && (
									<Avatar className="size-10">
										<AvatarImage
											src={member?.image || "/shad.png"}
											alt="@shadcn"
										/>
										<AvatarFallback>SC</AvatarFallback>
									</Avatar>
								)}
								<div>
									<p className="text-sm font-medium leading-none">
										{member.name}
									</p>
									<p className="text-sm text-muted-foreground">
										{member.email}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											className="group hover:border-red-500 hover:bg-red-50"
										>
											<Trash2 className="size-4 group-hover:text-red-500" />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
											<AlertDialogDescription>
												Esta ação não pode ser desfeita. Isso excluirá
												permanentemente o membro de seu workspace.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancelar</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => handleDeleteMember(member.id)}
											>
												Continuar
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
