export interface AppFormData {
  basicInformation: {
    name: string;
    subtitle: string;
    description: string;
  };
  images: {
    icon: FormData | null;
    imageUrlWithoutS3: string;
    emojiAvatar: string;
    emojiAvatarType: "emoji" | "lucide" | "image";
    galleryPhotos: null;
  };
  principalLink: {
    title: string;
    link: string;
    type: "none" | "iframe" | "newWindow" | "sameWindow";
  };
  sublinks: Array<{
    title: string;
    link: string;
    type: "none" | "iframe" | "newWindow" | "sameWindow";
  }>;
}
