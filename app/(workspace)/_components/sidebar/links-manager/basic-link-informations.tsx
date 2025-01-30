/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { z } from "zod";
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LinkFormData } from "./types";
import { AvatarSelector } from "@/components/avatar-selector";
import { base64ToBlob } from "@/lib/utils";
import { getFavicon } from "@/utils/get-favicon";

interface GetPrincipalLinkProps {
	data: LinkFormData;
	updateFormData: (
		section: keyof LinkFormData,
		updates: Partial<LinkFormData[keyof LinkFormData]>,
	) => void;
	isSublink?: boolean;
	setStepValidation: (isValid: boolean) => void;
}

export function BasicLinkInformation({
	data,
	updateFormData,
	isSublink,
	setStepValidation,
}: GetPrincipalLinkProps) {
	const { title, link, type } = data.principalLink;

	const principalLinkSchema = z.object({
		title: z.string().min(1, "Título é obrigatório"),
		link: z.string().refine(
			(value) => {
				if (data.principalLink.type === "none") return true;
				return value.length > 0 && /^https?:\/\/.*/.test(value);
			},
			{
				message: "Link inválido",
			},
		),
	});

	const handleAvatarChange = (avatar: {
		value: string;
		type: "image" | "emoji" | "lucide";
	}) => {
		const formData = new FormData();

		switch (avatar.type) {
			case "image": {
				const blob = base64ToBlob(avatar.value);
				formData.append("icon", blob, "avatar.jpeg");
				formData.append("iconType", avatar.type);

				updateFormData("images", {
					icon: formData,
					imageUrlWithoutS3: URL.createObjectURL(blob),
					emojiAvatar: "",
					emojiAvatarType: avatar.type,
				});
				break;
			}
			case "emoji":
			case "lucide":
				formData.append("icon", avatar.value);
				formData.append("iconType", avatar.type);
				updateFormData("images", {
					icon: formData,
					imageUrlWithoutS3: "",
					emojiAvatar: avatar.value,
					emojiAvatarType: avatar.type,
				});
				break;
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			const validationResult = principalLinkSchema.safeParse(
				data.principalLink,
			);

			setStepValidation(validationResult.success && !!data.images.icon);
		}, 0);

		return () => clearTimeout(timer);
	}, [data.principalLink, data.images]);

	const handleChange = (field: string, value: string) => {
		if (value == "none") {
			updateFormData("principalLink", { link: "" });
		}

		if (field === "link") {
			const favicon = getFavicon(value);

			if (favicon) {
				const formData = new FormData();

				formData.append("icon", favicon);
				formData.append("iconType", "favicon");

				updateFormData("images", {
					icon: formData,
					emojiAvatar: favicon,
					imageUrlWithoutS3: "",
					emojiAvatarType: "favicon",
				});
			}
		}

		updateFormData("principalLink", { [field]: value });
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>
					Adicionar {!isSublink ? "link principal" : "sublink"} ao aplicativo
				</DialogTitle>
				<DialogDescription>
					Adicione o {!isSublink ? "link principal" : "sublink"} do aplicativo,
					que será o link que o usuário irá usar para acessar a tela principal
					do aplicativo.
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4">
				<div>
					<Label htmlFor="title">Ícone do link *</Label>
					<div>
						<AvatarSelector
							data={
								data.images.emojiAvatar
									? {
											value: data.images.emojiAvatar,
											type: data.images.emojiAvatarType,
										}
									: null
							}
							className="w-[120px]"
							emojiSize="4rem"
							imageUrlWithoutS3={
								data.images.imageUrlWithoutS3
									? data.images.imageUrlWithoutS3
									: null
							}
							onAvatarChange={handleAvatarChange}
						/>
					</div>
				</div>
				<div>
					<Label htmlFor="title">Título *</Label>
					<Input
						id="title"
						placeholder="Coloque um nome para o aplicativo"
						value={title}
						onChange={(e) => handleChange("title", e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor="link">Link do aplicativo *</Label>
					<Input
						id="link"
						placeholder="https://seu-aplicativo.com"
						value={link}
						onChange={(e) => handleChange("link", e.target.value)}
						disabled={type === "none"}
					/>
				</div>
				<div className="space-y-4">
					<Label htmlFor="type">
						Tipo de {!isSublink ? "link" : "sublink"} *
					</Label>
					<RadioGroup
						value={type}
						onValueChange={(value) => handleChange("type", value)}
						className="space-y-2"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="none" id="r1" />
							<Label htmlFor="r1">Nenhum</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="iframe" id="r2" />
							<Label htmlFor="r2">Iframe</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="newWindow" id="r3" />
							<Label htmlFor="r3">Nova janela</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="sameWindow" id="r3" />
							<Label htmlFor="r3">Mesma janela</Label>
						</div>
					</RadioGroup>
				</div>
			</div>
		</>
	);
}
