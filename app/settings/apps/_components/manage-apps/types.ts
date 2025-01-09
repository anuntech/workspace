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
    emojiAvatarType: "emoji" | "lucide";
    galleryPhotos: FileList | null;
  };
  principalLink: {
    title: string;
    link: string;
    type: string;
  };
}
