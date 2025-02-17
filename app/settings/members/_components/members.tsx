"use client";

import { IconComponent } from "@/components/get-lucide-icons";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function Members() {
	const searchParams = useSearchParams();
	const workspace = searchParams.get("workspace");

	const queryClient = useQueryClient();

	const ownerQuery = useQuery({
		queryKey: ["workspace/owner"],
		queryFn: () =>
			fetch(`/api/workspace/owner/${workspace}`).then((res) => res.json()),
	});

	const membersQuery = useQuery({
		queryKey: ["workspace/members"],
		queryFn: () => api.get(`/api/workspace/members/${workspace}`),
	});

	const userQuery = useQuery({
		queryKey: ["user"],
		queryFn: () => fetch("/api/user").then((res) => res.json()),
	});

	const updateMutation = useMutation({
		mutationFn: (data: {
			workspaceId: string;
			memberId: string;
			role: string;
		}) =>
			fetch(`/api/workspace/member/${data.workspaceId}/${data.memberId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ role: data.role }),
			}),
		onSuccess: () => {
			queryClient.refetchQueries({
				queryKey: ["workspace/members"],
				type: "active",
			});
		},
	});

	const transferOwnerMutation = useMutation({
		mutationFn: (data: { workspaceId: string; userId: string }) =>
			fetch(`/api/workspace/transfer-owner`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}),
		onSuccess: () =>
			Promise.all([
				queryClient.refetchQueries({
					queryKey: ["workspace/members"],
					type: "active",
				}),
				queryClient.refetchQueries({
					queryKey: ["workspace/owner"],
					type: "active",
				}),
			]),
	});

	const deleteMutation = useMutation({
		mutationFn: (data: { workspaceId: string; userId: string }) =>
			fetch(`/api/workspace/member/${data.workspaceId}/${data.userId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			}),
		onSuccess: () => {
			queryClient.refetchQueries({
				queryKey: ["workspace/members"],
				type: "active",
			});
		},
	});

	const handleRoleChange = async (memberId: string, role: string) => {
		updateMutation.mutate({
			workspaceId: workspace,
			memberId: memberId,
			role: role,
		});
	};

	const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

	const handleTransferOwner = async (memberId: string) => {
		transferOwnerMutation.mutate({
			workspaceId: workspace,
			userId: memberId,
		});
	};

	const yourMemberInfo = membersQuery.data?.data?.find(
		(member: any) => member._id.toString() == userQuery.data?._id.toString(),
	);

	return (
		<div className="space-y-5">
			<section>
				<h2 className="text-lg font-bold">Membros do workspace</h2>
				<span className="text-sm text-zinc-500">
					Convide os membros da sua equipe para colaborar.
				</span>
			</section>
			{deleteMutation.isPending ||
			ownerQuery.isPending ||
			membersQuery.isPending ? (
				<div className="space-y-3">
					<Skeleton className="h-11 w-full justify-start gap-2 px-3 text-start" />
					<Skeleton className="h-11 w-full justify-start gap-2 px-3 text-start" />
					<Skeleton className="h-11 w-full justify-start gap-2 px-3 text-start" />
				</div>
			) : (
				<>
					<div className="flex items-center justify-between space-x-4">
						<div className="flex items-center space-x-4">
							{!ownerQuery.data?.icon && (
								<Avatar className="size-10">
									<AvatarImage
										src={ownerQuery.data?.image || "/shad.png"}
										alt="@shadcn"
									/>
									<AvatarFallback>SC</AvatarFallback>
								</Avatar>
							)}
							{ownerQuery.data?.icon?.type === "emoji" && (
								<span className="text-[2rem] w-full h-full flex size-10">
									{ownerQuery.data?.icon.value}
								</span>
							)}
							{ownerQuery.data?.icon?.type === "image" && (
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={
											getS3Image(ownerQuery.data?.icon?.value) || "/shad.png"
										}
										alt="@shadcn"
									/>
									<AvatarFallback className="rounded-lg">SC</AvatarFallback>
								</Avatar>
							)}
							{ownerQuery.data?.icon?.type === "lucide" && (
								<span className="text-[2rem] w-full h-full flex size-10">
									<IconComponent
										className="size-10"
										name={ownerQuery.data?.icon.value}
									/>
								</span>
							)}
							<div>
								<p className="text-sm font-medium leading-none">
									{ownerQuery.data?.name}
								</p>
								<p className="text-sm text-muted-foreground">
									{ownerQuery.data?.email}
								</p>
							</div>
						</div>
					</div>
					{membersQuery.data?.data?.map((member: any) => (
						<div
							key={member._id}
							className="flex items-center justify-between space-x-4"
						>
							<div className="flex items-center space-x-4">
								{!member.icon && (
									<Avatar className="size-10">
										<AvatarImage
											src={member?.image || "/shad.png"}
											alt="@shadcn"
										/>
										<AvatarFallback>SC</AvatarFallback>
									</Avatar>
								)}
								{member?.icon?.type === "emoji" && (
									<span className="text-[1.3rem]">{member.icon.value}</span>
								)}
								{member?.icon?.type === "image" && (
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={getS3Image(member?.icon?.value) || "/shad.png"}
											alt="@shadcn"
										/>
										<AvatarFallback className="rounded-lg">SC</AvatarFallback>
									</Avatar>
								)}
								{member?.icon?.type === "lucide" && (
									<span className="text-[2rem] w-full h-full flex size-10">
										<IconComponent
											className="size-10"
											name={member?.icon.value}
										/>
									</span>
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
								<Select
									open={openStates[member._id] || false}
									onOpenChange={(open) =>
										setOpenStates((prev) => ({ ...prev, [member._id]: open }))
									}
									defaultValue={member.role}
									onValueChange={(props) => handleRoleChange(member._id, props)}
									disabled={yourMemberInfo?.role == "member"}
								>
									<SelectTrigger className="w-36">
										<SelectValue placeholder="Selecione um cargo" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="admin">Administrador</SelectItem>
											<SelectItem value="member">Membro</SelectItem>
											<Separator
												className={clsx(
													"my-1 h-px bg-gray-200",
													ownerQuery?.data.id.toString() !=
														userQuery?.data?._id.toString() && "hidden",
												)}
											/>
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button
														value="owner"
														variant="ghost"
														className={clsx(
															"text-destructive w-full text-left p-2 hover:bg-gray-100 rounded-sm focus:bg-gray-100",
															ownerQuery?.data.id.toString() !=
																userQuery?.data?._id.toString() && "hidden",
														)}
													>
														Transferir proprietário
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>
															Você tem certeza?
														</AlertDialogTitle>
														<AlertDialogDescription>
															Esta ação não pode ser desfeita. Isso excluirá
															permanentemente o membro de seu workspace.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancelar</AlertDialogCancel>
														<AlertDialogAction
															onClick={() => handleTransferOwner(member._id)}
														>
															Continuar
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</SelectGroup>
									</SelectContent>
								</Select>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											disabled={
												yourMemberInfo?.role == "member" ||
												userQuery.data?._id.toString() == member._id.toString()
											}
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
												onClick={() =>
													deleteMutation.mutate({
														workspaceId: workspace,
														userId: member._id,
													})
												}
											>
												Continuar
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
					))}
				</>
			)}
		</div>
	);
}
