"use client";

import { AvatarSelector } from "@/components/avatar-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	BasicInformationForm,
	basicInformationSchema,
} from "@/schemas/basic-information";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { base64ToBlob } from "@/lib/utils";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { Button } from "@/components/ui/button";

interface Props {
	data: {
		basicInformation: {
			name: string;
			subtitle: string;
			description: string;
		};
		images: {
			emojiAvatar: string;
			emojiAvatarType: "emoji" | "lucide";
			galleryPhotos?: FileList;
			imageUrlWithoutS3: string;
		};
	};
	id: string;
}

interface BasicInformationWithImagesForm extends BasicInformationForm {
	images: {
		icon: FormData | null;
		imageUrlWithoutS3: string;
		emojiAvatar: string;
		emojiAvatarType: "emoji" | "lucide" | "image";
		galleryPhotos?: FileList;
	};
}

export const Configs = ({ data, id }: Props) => {
	const {
		handleSubmit,
		register,
		formState: { isValid },
		setValue,
		getValues,
		watch,
	} = useForm<BasicInformationWithImagesForm>({
		defaultValues: {
			name: data.basicInformation.name,
			subtitle: data.basicInformation.subtitle,
			description: data.basicInformation.description,
			images: {
				icon: null,
				imageUrlWithoutS3: data.images.imageUrlWithoutS3,
				emojiAvatar: data.images.emojiAvatar,
				emojiAvatarType: data.images.emojiAvatarType,
				galleryPhotos: data.images.galleryPhotos,
			},
		},
		resolver: zodResolver(basicInformationSchema),
		mode: "onChange",
	});

	const queryClient = useQueryClient();

	const saveApplicationMutation = useMutation({
		mutationFn: async (data: BasicInformationWithImagesForm) => {
			const formData = new FormData();

			formData.append("name", data.name);
			formData.append("subtitle", data.subtitle);
			formData.append("description", data.description);
			formData.append("icon", data.images.icon.get("icon"));
			formData.append("iconType", data.images.emojiAvatarType);

			if (data.images.galleryPhotos && data.images.galleryPhotos.length > 0) {
				Array.from(data.images.galleryPhotos).forEach((file) => {
					formData.append("galeryPhotos", file);
				});
			}

			formData.append("id", id);

			const { data: dataUpdated } = await api.put(
				"/api/applications/edit/configs",
				formData,
			);

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
		},
		onError: () => {
			toast({
				description: "Algo deu errado ao salvar o aplicativo.",
				duration: 5000,
				variant: "destructive",
			});
		},
	});

	const handleAvatarChange = useCallback(
		(avatar: { value: string; type: "image" | "emoji" | "lucide" }) => {
			const formData = new FormData();

			switch (avatar.type) {
				case "image": {
					const blob = base64ToBlob(avatar.value);
					formData.append("icon", blob, "avatar.jpeg");
					formData.append("iconType", avatar.type);

					setValue("images.icon", formData);
					setValue("images.imageUrlWithoutS3", URL.createObjectURL(blob));
					setValue("images.emojiAvatar", avatar.value);
					setValue("images.emojiAvatarType", avatar.type);

					break;
				}
				case "emoji":
				case "lucide":
					formData.append("icon", avatar.value);
					formData.append("iconType", avatar.type);

					setValue("images.icon", formData);
					setValue("images.imageUrlWithoutS3", "");
					setValue("images.emojiAvatar", avatar.value);
					setValue("images.emojiAvatarType", avatar.type);

					break;
			}
		},
		[setValue],
	);

	const watchedEmojiAvatar = watch("images.emojiAvatar");
	const watchedEmojiAvatarType = watch("images.emojiAvatarType");
	const watchedImageUrlWithoutS3 = watch("images.imageUrlWithoutS3");

	useEffect(() => {
		const formData = new FormData();

		formData.append("icon", data.images.emojiAvatar);
		formData.append("iconType", data.images.emojiAvatarType);

		setValue("images.icon", formData);
		setValue("images.imageUrlWithoutS3", data.images.imageUrlWithoutS3);
		setValue("images.emojiAvatar", data.images.emojiAvatar);
		setValue("images.emojiAvatarType", data.images.emojiAvatarType);
	}, [
		data.images.emojiAvatar,
		data.images.emojiAvatarType,
		data.images.imageUrlWithoutS3,
		setValue,
	]);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const watchedGalleryPhotos = watch("images.galleryPhotos");

	useEffect(() => {
		if (fileInputRef.current && watchedGalleryPhotos) {
			const dataTransfer = new DataTransfer();

			Array.from(watchedGalleryPhotos).forEach((file) => {
				dataTransfer.items.add(file);
			});
			fileInputRef.current.files = dataTransfer.files;
		}
	}, [setValue, watchedGalleryPhotos]);

	const onSubmit = (data: BasicInformationForm) => {
		if (!isValid) return;


		const dataWithImages = {
			...data,
			images: getValues("images"),
		};


		saveApplicationMutation.mutate(dataWithImages);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col w-full max-w-lg gap-4 items-end"
		>
			<div className="w-full">
				<Label htmlFor="name">Ícone do aplicativo *</Label>
				<AvatarSelector
					data={
						data.images.emojiAvatar
							? {
									value: watchedEmojiAvatar,
									type: watchedEmojiAvatarType,
								}
							: null
					}
					className="w-[80px]"
					emojiSize="4rem"
					imageUrlWithoutS3={
						watchedImageUrlWithoutS3 ? watchedImageUrlWithoutS3 : null
					}
					onAvatarChange={handleAvatarChange}
				/>
			</div>
			<div className="w-full">
				<Label htmlFor="name">Fotos do aplicativo</Label>
				<Input
					ref={fileInputRef}
					className="cursor-pointer"
					placeholder="Selecione até 20 imagens"
					type="file"
					accept="image/*"
					multiple
					{...register("images.galleryPhotos", {
						validate: (value) => {
							if (value && value.length > 20) {
								toast({
									title: "Você não pode selecionar mais de 20 imagens",
									variant: "destructive",
									duration: 3000,
								});

								return "Você não pode selecionar mais de 20 imagens";
							}

							return true;
						},
					})}
				/>
			</div>
			<div className="w-full">
				<Label htmlFor="name">Nome do aplicativo *</Label>
				<Input
					id="name"
					placeholder="Coloque um nome para o aplicativo"
					{...register("name")}
				/>
			</div>
			<div className="w-full">
				<Label htmlFor="subtitle">Subtítulo do aplicativo *</Label>
				<Input
					id="subtitle"
					placeholder='"Seu aplicativo de produtividade"'
					{...register("subtitle")}
				/>
			</div>
			<div className="w-full">
				<Label htmlFor="description">Descrição do aplicativo *</Label>
				<Textarea
					id="description"
					placeholder="Um aplicativo feito para te ajudar na sua produtividade"
					{...register("description")}
				/>
			</div>
			<Button
				type="submit"
				disabled={!isValid || saveApplicationMutation.isPending}
				className="max-w-24 w-full"
			>
				Salvar
			</Button>
		</form>
	);
};
