"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { initialWorkspaceIcons } from "@/libs/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { AxiosError } from "axios";

const workspaceSchema = z
	.string()
	.min(
		1,
		"O nome do workspace não pode estar vazio. Por favor, insira um nome antes de continuar.",
	)
	.max(
		50,
		"O nome do workspace não pode exceder 50 caracteres. Por favor, insira um nome mais curto.",
	)
	.regex(
		/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-_]+$/,
		"O nome do workspace contém caracteres inválidos. Use apenas letras, números, espaços, traços ou sublinhados.",
	);

export function CreateWorkspaceForm() {
	const [name, setName] = useState("");
	const router = useRouter();
	const queryClient = useQueryClient();

	const sendCreateWorkspaceEmail = useMutation({
		mutationFn: (data: any) => api.post("/api/workspace", data),
		onSuccess: async (data) => {
			await queryClient.refetchQueries({
				queryKey: ["workspace"],
				type: "all",
			});

			router.push(`/?workspace=${(await data.data).id}`);
		},
		onError: (err: AxiosError) => {
			const errorMessage =
				(err.response?.data as any)?.error ||
				"Erro ao criar workspace. Tente novamente.";
			if (errorMessage.includes("limite")) {
				toast({
					title: "Limite atingido",
					description:
						"Você atingiu o limite de workspaces criados. Exclua um existente ou entre em contato com o suporte.",
					variant: "destructive",
					duration: 7000,
				});
			} else {
				toast({
					title: "Erro ao criar workspace",
					description: errorMessage,
					variant: "destructive",
					duration: 7000,
				});
			}
		},
	});

	const handleCreateWorkspace = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const result = workspaceSchema.safeParse(name);
		if (!result.success) {
			toast({
				title: "Erro ao criar o workspace",
				description: result.error.errors[0].message,
				variant: "destructive",
				duration: 7000,
			});
			return;
		}

		const randomIcon =
			initialWorkspaceIcons[
				Math.floor(Math.random() * initialWorkspaceIcons.length)
			];
		const data = {
			name,
			icon: { type: "emoji", value: randomIcon },
		};

		sendCreateWorkspaceEmail.mutate(data);
	};

	return (
		<form
			action="/"
			method="POST"
			onSubmit={handleCreateWorkspace}
			className="w-full space-y-4"
		>
			<Input
				type="text"
				disabled={sendCreateWorkspaceEmail.isPending}
				name="name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Nome do seu workspace..."
				className="py-6"
				autoFocus
			/>
			<Button
				disabled={
					sendCreateWorkspaceEmail.isPending ||
					sendCreateWorkspaceEmail.isSuccess
				}
				type="submit"
				className="w-full py-6"
			>
				Continuar
			</Button>
		</form>
	);
}
