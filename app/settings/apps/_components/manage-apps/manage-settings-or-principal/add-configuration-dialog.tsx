/* eslint-disable no-unused-vars */
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AppFormData } from "../types";
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddConfigurationDialogProps {
	data: AppFormData;
	updateFormData: (
		section: keyof AppFormData,
		updates: Partial<AppFormData[keyof AppFormData]>,
	) => void;
	editIndex?: number;
	initialValues?: {
		title: string;
		link: string;
		type: "none" | "iframe" | "newWindow" | "sameWindow";
	};
	onClose?: () => void;
}

const configurationSchema = z.object({
	title: z.string().min(1, "Título é obrigatório"),
	link: z.string().url("Link inválido").min(1, "Link é obrigatório"),
	type: z.enum(["none", "iframe", "newWindow", "sameWindow"]),
});

type ConfigurationForm = z.infer<typeof configurationSchema>;

export function AddConfigurationDialog({
	data,
	updateFormData,
	editIndex,
	initialValues,
	onClose,
}: AddConfigurationDialogProps) {
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm<ConfigurationForm>({
		resolver: zodResolver(configurationSchema),
		defaultValues: initialValues || {
			title: "",
			link: "",
			type: "iframe",
		},
	});

	const onSubmit = (values: ConfigurationForm) => {
		const newConfiguration = {
			title: values.title,
			link: values.link,
			type: values.type,
		};

		if (editIndex !== undefined) {
			// Modo de edição
			const updatedConfigurations = [...(data.configurationOptions || [])];
			updatedConfigurations[editIndex] = newConfiguration;
			updateFormData("configurationOptions", updatedConfigurations);
			onClose?.();
		} else {
			// Modo de adição
			updateFormData("configurationOptions", [
				...(data.configurationOptions || []),
				newConfiguration,
			]);
			setIsOpen(false);
		}
		form.reset();
	};

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open && onClose) {
			onClose();
		}
	};

	return (
		<Dialog
			open={editIndex !== undefined ? true : isOpen}
			onOpenChange={handleOpenChange}
		>
			{!editIndex && (
				<DialogTrigger asChild>
					<Button variant="outline" className="w-48 mt-3">
						Adicionar configuração
					</Button>
				</DialogTrigger>
			)}
			<DialogContent className="max-w-lg p-6">
				<DialogHeader>
					<DialogTitle>
						{editIndex !== undefined
							? "Editar configuração"
							: "Adicionar opção de configuração"}
					</DialogTitle>
					<DialogDescription>
						{editIndex !== undefined
							? "Edite os detalhes da configuração."
							: "Adicione uma opção de configuração ao aplicativo."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
					<div>
						<Label htmlFor="title">Título da configuração *</Label>
						<Input
							id="title"
							placeholder="Nome da configuração"
							{...form.register("title")}
						/>
						{form.formState.errors.title && (
							<span className="text-sm text-red-500">
								{form.formState.errors.title.message}
							</span>
						)}
					</div>

					<div>
						<Label htmlFor="link">Link da configuração *</Label>
						<Input
							id="link"
							placeholder="https://seu-aplicativo.com/configuracao"
							{...form.register("link")}
						/>
						{form.formState.errors.link && (
							<span className="text-sm text-red-500">
								{form.formState.errors.link.message}
							</span>
						)}
					</div>

					<div className="space-y-4">
						<Label htmlFor="type">Tipo de configuração *</Label>
						<RadioGroup
							value={form.watch("type")}
							onValueChange={(value) => form.setValue("type", value as any)}
							className="space-y-2"
							defaultValue="iframe"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="iframe" id="r2" />
								<Label htmlFor="r2">Iframe</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="newWindow" id="r3" />
								<Label htmlFor="r3">Nova janela</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="sameWindow" id="r4" />
								<Label htmlFor="r4">Mesma janela</Label>
							</div>
						</RadioGroup>
					</div>

					<div className="flex justify-end mt-4">
						<Button type="submit">
							{editIndex !== undefined
								? "Salvar alterações"
								: "Adicionar configuração"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
