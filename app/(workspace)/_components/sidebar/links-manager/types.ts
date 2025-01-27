export interface LinkFormData {
	images: {
		icon: FormData | null;
		imageUrlWithoutS3: string;
		emojiAvatar: string;
		emojiAvatarType: "emoji" | "lucide" | "image";
		galleryPhotos: FileList;
	};
	principalLink: {
		title: string;
		link: string;
		type: "none" | "iframe" | "newWindow" | "sameWindow";
	};
	sublinks: Array<{
		title: string;
		link: string;
		type: "iframe" | "newWindow" | "sameWindow";
	}>;
}
