"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { useRouter, useSearchParams } from "next/navigation";

import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, MoreHorizontal, PackageX, Share2 } from "lucide-react";
import { useSession } from "next-auth/react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
	const [isOpenAlert, setIsOpenAlert] = useState(false);
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
			a.userId == session.data?.user?.id && a.applicationId.id == applicationId,
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

	const roleQuery = useQuery({
		queryKey: ["workspace/role"],
		queryFn: () =>
			fetch(`/api/workspace/role/${workspace}`).then(async (res) => ({
				data: await res.json(),
				status: res.status,
			})),
	});

	const router = useRouter();

	return (
		<>
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

						{roleQuery.data?.data?.role !== "member" &&
							!roleQuery.isPending && (
								<>
									<DropdownMenuItem
										onClick={() =>
											router.push(
												`/settings/manage-apps/${applicationId}?workspace=${workspace}`,
											)
										}
									>
										<Share2 />
										Compartilhar
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => setIsOpenAlert(true)}>
										<PackageX />
										Desinstalar
									</DropdownMenuItem>
								</>
							)}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialogDemo
				isOpen={isOpenAlert}
				setIsOpen={setIsOpenAlert}
				applicationId={applicationId}
			/>
		</>
	);
}

function AlertDialogDemo({
	isOpen,
	setIsOpen,
	applicationId,
}: {
	isOpen: boolean;
	setIsOpen: any;
	applicationId: string;
}) {
	const queryClient = useQueryClient();
	const urlParams = useSearchParams();
	const workspace = urlParams.get("workspace");

	const deleteApplicationMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/applications/${workspace}/allow`, {
				body: JSON.stringify({
					applicationId: applicationId,
				}),
				method: "DELETE",
			});
			return res.json();
		},
		onSuccess: async () => {
			await queryClient.refetchQueries({
				queryKey: ["applications/allow"],
			});
			await queryClient.refetchQueries({
				queryKey: ["applications/favorite"],
			});
		},
	});

	return (
		<AlertDialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				setTimeout(() => (document.body.style.pointerEvents = ""), 500);
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
					<AlertDialogDescription>
						Essa ação vai desinstalar seu aplicativo e todos os os membros
						associados a esse workspace não terão mais acesso a ele.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction onClick={() => deleteApplicationMutation.mutate()}>
						Continuar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
