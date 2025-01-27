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
import { Pencil } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface AddSublinkDialogProps {
	data: AppFormData;
	updateFormData: (
		section: keyof AppFormData,
		updates: Partial<AppFormData[keyof AppFormData]>
	) => void;
	editIndex?: number;
	initialValues?: {
		title: string;
		link: string;
		type: "none" | "iframe" | "newWindow" | "sameWindow";
	};
	onClose?: () => void;
}

const sublinkSchema = z.object({
	title: z.string().min(1, "Título é obrigatório"),
	link: z.string().url("Link inválido").min(1, "Link é obrigatório"),
	type: z.enum(["none", "iframe", "newWindow", "sameWindow"]),
});

type SublinkForm = z.infer<typeof sublinkSchema>;

export function AddSublinkDialog({
	data,
	updateFormData,
	editIndex,
	initialValues,
	onClose,
}: AddSublinkDialogProps) {
	const [isOpen, setIsOpen] = useState(editIndex !== undefined);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open && onClose) {
			onClose();
		}
	};

	const form = useForm<SublinkForm>({
		resolver: zodResolver(sublinkSchema),
		defaultValues: initialValues || {
			title: "",
			link: "",
			type: "iframe",
		},
	});

	const onSubmit = (values: SublinkForm) => {
		const newSublink = {
			title: values.title,
			link: values.link,
			type: values.type,
		};

		if (editIndex !== undefined) {
			const newSublinks = [...data.sublinks];
			newSublinks[editIndex] = newSublink;
			updateFormData("sublinks", newSublinks);
		} else {
			updateFormData("sublinks", [...(data.sublinks || []), newSublink]);
		}

		setIsOpen(false);
		form.reset();
		if (onClose) {
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{!editIndex && (
					<Button variant="outline" className="w-48 mt-3">
						Adicionar sublink
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-lg p-6">
				<DialogHeader>
					<DialogTitle>
						{editIndex !== undefined
							? "Editar sublink"
							: "Adicionar sublink ao aplicativo"}
					</DialogTitle>
					<DialogDescription>
						Adicione um sublink ao aplicativo, que será exibido abaixo do link
						principal.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
					<div>
						<Label htmlFor="title">Título do sublink *</Label>
						<Input
							id="title"
							placeholder="Nome do sublink"
							{...form.register("title")}
						/>
						{form.formState.errors.title && (
							<span className="text-sm text-red-500">
								{form.formState.errors.title.message}
							</span>
						)}
					</div>

					<div>
						<Label htmlFor="link">Link do sublink *</Label>
						<Input
							id="link"
							placeholder="https://seu-aplicativo.com/sublink"
							{...form.register("link")}
						/>
						{form.formState.errors.link && (
							<span className="text-sm text-red-500">
								{form.formState.errors.link.message}
							</span>
						)}
					</div>

					<div className="space-y-4">
						<Label htmlFor="type">Tipo de sublink *</Label>
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
						<Button type="submit">Adicionar sublink</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
