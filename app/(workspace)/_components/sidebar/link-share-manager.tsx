import React, { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { UserSearchInput } from "@/components/user-search-input";
import { IUser } from "@/models/User";
import { Button } from "@/components/ui/button";
import api from "@/libs/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
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
import Image from "next/image";
import { getS3Image } from "@/libs/s3-client";

export function LinkShareManager({
	linkId,
	isOpen,
	setIsOpen,
	workspaceId,
}: {
	linkId: string;
	isOpen: boolean;
	// eslint-disable-next-line no-unused-vars
	setIsOpen: (open: boolean) => void;
	workspaceId: string;
}) {
	const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);

	const membersAllowed = useQuery({
		queryKey: ["links"],
		queryFn: () =>
			api.get(
				`/api/workspace/link/manage-members-allowed?workspaceId=${workspaceId}&linkId=${linkId}`
			),
	});

	const manageMembersAllowedMutation = useMutation({
		mutationFn: () =>
			api.post(`/api/workspace/link/manage-members-allowed`, {
				linkId,
				membersId: selectedUsers.map((user) => user._id),
				workspaceId,
			}),
		onSuccess: () => {
			toast({
				title: "Membro(s) adicionado(s) com sucesso",
			});
			setSelectedUsers([]);
			membersAllowed.refetch();
		},
		onError: () => {
			toast({
				title: "Erro ao adicionar membro(s)",
			});
		},
	});

	const deleteMemberMutation = useMutation({
		mutationFn: (memberId: string) =>
			api.delete(
				`/api/workspace/link/manage-members-allowed?linkId=${linkId}&memberId=${memberId}&workspaceId=${workspaceId}`
			),
		onSuccess: () => {
			toast({
				title: "Membro removido com sucesso",
			});
			membersAllowed.refetch();
		},
		onError: () => {
			toast({
				title: "Erro ao remover membro",
			});
		},
	});

	const handleShare = () => {
		manageMembersAllowedMutation.mutate();
	};

	const handleDelete = (memberId: string) => {
		deleteMemberMutation.mutate(memberId);
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				setTimeout(() => (document.body.style.pointerEvents = ""), 500);
			}}
		>
			<DialogTrigger asChild></DialogTrigger>
			<DialogContent className="h-2/4 flex flex-col">
				<DialogHeader className="h-max">
					<DialogTitle>Adicionar membros para um link?</DialogTitle>
					<DialogDescription>
						Adicione os membros da sua equipe para que eles possam acessar a
						esse link
					</DialogDescription>
				</DialogHeader>
				<div className="flex gap-2 items-center">
					<UserSearchInput
						selectedUsers={selectedUsers}
						setSelectedUsers={setSelectedUsers}
						workspaceId={workspaceId}
						excludedUsers={membersAllowed.data?.data}
					/>
					<Button
						onClick={() => handleShare()}
						disabled={selectedUsers.length < 1}
					>
						Adicionar
					</Button>
				</div>
				<div className="max-h-[90%] overflow-y-auto">
					{membersAllowed.data?.data?.map((member: any) => (
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
												onClick={() => handleDelete(member.id)}
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
			</DialogContent>
		</Dialog>
	);
}
