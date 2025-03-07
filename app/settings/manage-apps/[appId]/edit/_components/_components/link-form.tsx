import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/libs/api";
import {
	PrincipalLinkForm,
	principalLinkSchema,
} from "@/schemas/principal-link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { DeleteButton } from "./_components/delete-button";

interface Props {
	data: {
		basicInformation: {
			name: string;
		};
		link: {
			applicationUrl: string;
			applicationUrlType: "none" | "iframe" | "newWindow" | "sameWindow";
		};
	};
	id: string;
	fieldId?: string;
	menuType: "menu-main" | "menu-config";
	linkType: "principal-link" | "sub-link-edit" | "sub-link-create";
	openButtonText?: string;
}

export const LinkFormComponent = ({
	data,
	id,
	fieldId,
	menuType,
	linkType,
	openButtonText,
}: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm<PrincipalLinkForm>({
		defaultValues: {
			title: data.basicInformation.name,
			link: data.link.applicationUrl,
			type: data.link.applicationUrlType,
		},
		resolver: zodResolver(principalLinkSchema),
		mode: "onChange",
	});

	const {
		handleSubmit,
		formState: { isValid },
		watch,
		setValue,
		control,
		clearErrors,
		setError,
	} = form;

	const queryClient = useQueryClient();

	const saveApplicationMutation = useMutation({
		mutationFn: async (data: PrincipalLinkForm) => {
			const formData = new FormData();

			formData.append("title", data.title);
			formData.append("applicationUrl", data.link);
			formData.append("applicationUrlType", data.type);

			formData.append("id", id);

			if (linkType !== "principal-link" && fieldId) {
				formData.append("fieldId", fieldId);
			}

			let dataUpdated;

			if (linkType === "sub-link-create") {
				const { data } = await api.post(
					`/api/applications/edit/${menuType}`,
					formData,
				);

				dataUpdated = data;
			}

			if (linkType === "sub-link-edit") {
				const { data } = await api.put(
					`/api/applications/edit/${menuType}`,
					formData,
				);

				dataUpdated = data;
			}

			if (linkType === "principal-link") {
				const { data } = await api.put(
					`/api/applications/edit/${menuType}`,
					formData,
				);

				dataUpdated = data;
			}

			return dataUpdated;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["applications"],
				type: "all",
			});
			toast({
				description: "Aplicativo salvo com sucesso.",
				duration: 5000,
			});
			setIsOpen(false);
		},
		onError: () => {
			toast({
				description: "Algo deu errado ao salvar o aplicativo.",
				duration: 5000,
				variant: "destructive",
			});
		},
	});

	const onSubmit = (data: PrincipalLinkForm) => {
		if (!isValid) return;

		saveApplicationMutation.mutate(data);
	};

	const watchedType = watch("type");
	const watchedLink = watch("link");

	const handleRadioGroupChange = (value: string) => {
		setValue("type", value, { shouldValidate: true, shouldDirty: true });

		if (value === "none") {
			clearErrors("link");

			return;
		}

		const linkTest =
			watchedLink.length > 0 && /^https?:\/\/.*/.test(watchedLink);

		if (!linkTest) {
			setError("link", {
				message: "Link inválido",
			});
		}
	};

	return (
		<Form {...form}>
			<Dialog
				open={isOpen}
				onOpenChange={(open) => {
					setIsOpen(open);
				}}
			>
				<DialogTrigger asChild>
					<Button
						variant={
							openButtonText && linkType !== "principal-link"
								? "outline"
								: "ghost"
						}
						onClick={() => setIsOpen(true)}
						className={
							openButtonText && linkType === "sub-link-create"
								? "max-w-32 w-full"
								: "w-full flex items-start justify-start"
						}
					>
						{openButtonText && linkType !== "principal-link" ? (
							<span>{openButtonText}</span>
						) : (
							<Ellipsis />
						)}
					</Button>
				</DialogTrigger>
				<DialogContent
					className="max-w-lg p-6 space-y-4"
					onInteractOutside={(event) => event.preventDefault()}
				>
					<form onSubmit={handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>
								{linkType === "sub-link-create" ? "Adicionar" : "Atualizar"}{" "}
								{linkType === "principal-link" ? "link principal" : "sublink"}{" "}
								ao aplicativo
							</DialogTitle>
							<DialogDescription>
								{linkType === "sub-link-create" ? "Adicione" : "Atualize"} o{" "}
								{linkType === "principal-link" ? "link principal" : "sublink"}{" "}
								do aplicativo, que será o link que o usuário irá usar para
								acessar a tela principal do aplicativo.
							</DialogDescription>
						</DialogHeader>
						<div className="flex flex-col w-full max-w-lg gap-4 items-end">
							<div className="w-full">
								<FormField
									control={control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Título {linkType !== "principal-link" && "do sublink"} *
											</FormLabel>
											<FormControl>
												<Input
													id="title"
													placeholder="Coloque um nome para o aplicativo"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="w-full">
								<FormField
									control={control}
									name="link"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Link{" "}
												{linkType === "principal-link"
													? " do aplicativo"
													: "do sublink"}{" "}
												*
											</FormLabel>
											<FormControl>
												<Input
													id="link"
													placeholder="https://seu-aplicativo.com"
													{...field}
													disabled={watchedType === "none"}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="w-full space-y-4">
								<Label htmlFor="type">
									Tipo{" "}
									{linkType === "principal-link" ? " de link" : "de sublink"} *
								</Label>
								<RadioGroup
									value={watchedType}
									defaultValue={data.link.applicationUrlType}
									className="space-y-2"
								>
									{linkType === "principal-link" && (
										<div className="flex items-center space-x-2">
											<RadioGroupItem
												value="none"
												id="r1"
												onClick={() => handleRadioGroupChange("none")}
											/>
											<Label htmlFor="r1">Nenhum</Label>
										</div>
									)}
									<div className="flex items-center space-x-2">
										<RadioGroupItem
											value="iframe"
											id="r2"
											onClick={() => handleRadioGroupChange("iframe")}
										/>
										<Label htmlFor="r2">Iframe</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem
											value="newWindow"
											id="r3"
											onClick={() => handleRadioGroupChange("newWindow")}
										/>
										<Label htmlFor="r3">Nova janela</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem
											value="sameWindow"
											id="r3"
											onClick={() => handleRadioGroupChange("sameWindow")}
										/>
										<Label htmlFor="r3">Mesma janela</Label>
									</div>
								</RadioGroup>
							</div>
						</div>
						<DialogFooter>
							{linkType === "sub-link-edit" && (
								<DeleteButton
									id={id}
									fieldId={fieldId}
									menuType={menuType}
									linkType={linkType}
									setMainDialogState={setIsOpen}
								/>
							)}
							<Button
								type="submit"
								disabled={!isValid || saveApplicationMutation.isPending}
								className="max-w-24 w-full"
							>
								{linkType === "sub-link-create" ? "Adicionar" : "Salvar"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Form>
	);
};
