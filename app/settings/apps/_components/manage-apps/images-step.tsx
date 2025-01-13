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

interface ImagesStepProps {
  data: AppFormData;
  updateFormData: (
    section: keyof AppFormData,
    updates: Partial<AppFormData[keyof AppFormData]>
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
            className="cursor-pointer"
            placeholder="Selecione até 20 imagens"
            type="file"
            accept="image/*"
            multiple
          />
        </div>
      </div>
    </>
  );
}
