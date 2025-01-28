/* eslint-disable no-unused-vars */
import {
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base64ToBlob } from "@/lib/utils";
import { AvatarSelector } from "@/components/avatar-selector";
import { AppFormData } from "./types";
import React from "react";
import { toast } from "@/hooks/use-toast";

interface ImagesStepProps {
	data: AppFormData;
	updateFormData: (
		section: keyof AppFormData,
		updates: Partial<AppFormData[keyof AppFormData]>,
	) => void;
	setStepValidation: (isValid: boolean) => void;
}

export function ImagesStep({
	data,
	updateFormData,
	setStepValidation,
}: ImagesStepProps) {
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

		setStepValidation(true);
	};

	const fileInputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (fileInputRef.current && data.images.galleryPhotos) {
			const dataTransfer = new DataTransfer();

			Array.from(data.images.galleryPhotos).forEach((file) => {
				dataTransfer.items.add(file);
			});
			fileInputRef.current.files = dataTransfer.files;
		}
	}, [data.images.galleryPhotos]);

	const handleGalleryPhotosChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = event.target.files;
		if (files && files.length > 20) {
			toast({
				title: "Você não pode selecionar mais de 20 imagens",
				variant: "destructive",
				duration: 3000,
			});
			setStepValidation(false);
			return;
		}

		setStepValidation(true);
		updateFormData("images", {
			galleryPhotos: files as unknown as FileList,
		});
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>Coloque fotos para seu aplicativo</DialogTitle>
				<DialogDescription>
					Ajude as pessoas indentificar ser aplicativo
				</DialogDescription>
			</DialogHeader>
			<div className="flex flex-col gap-8">
				<div>
					<Label htmlFor="name">Ícone do aplicativo *</Label>
					<AvatarSelector
						data={
							data.images.emojiAvatar
								? {
										value: data.images.emojiAvatar,
										type: data.images.emojiAvatarType,
									}
								: null
						}
						className="w-[80px]"
						emojiSize="4rem"
						imageUrlWithoutS3={
							data.images.imageUrlWithoutS3
								? data.images.imageUrlWithoutS3
								: null
						}
						onAvatarChange={handleAvatarChange}
					/>
				</div>
				<div>
					<Label htmlFor="name">Fotos do aplicativo</Label>
					<Input
						ref={fileInputRef}
						className="cursor-pointer"
						placeholder="Selecione até 20 imagens"
						type="file"
						accept="image/*"
						multiple
						onChange={handleGalleryPhotosChange}
					/>
				</div>
			</div>
		</>
	);
}
