import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base64ToBlob } from "@/lib/utils";
import { AvatarSelector } from "@/components/avatar-selector";
import { useForm } from "react-hook-form";

export function ImagesStep() {
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");

  const [icon, setIcon] = useState<FormData>(null);
  const [imageUrlWithoutS3, setImageUrlWithoutS3] = useState<string>("");
  const [emojiAvatar, setEmojiAvatar] = useState<string>("");
  const [emojiAvatarType, setEmojiAvatarType] = useState<"emoji" | "lucide">(
    "emoji"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<any>();

  const isFormValid =
    name.trim() !== "" && subtitle.trim() !== "" && description.trim() !== "";

  const handleSave = () => {
    if (isFormValid) {
      console.log("Aplicativo salvo:", { name, subtitle, description });
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  };

  const handleAvatarChange = (avatar: {
    value: string;
    type: "image" | "emoji" | "lucide";
  }) => {
    const formData = new FormData();

    switch (avatar.type) {
      case "image":
        const blob = base64ToBlob(avatar.value);
        formData.append("icon", blob, "avatar.jpeg");
        formData.append("iconType", avatar.type);

        const imageUrl = URL.createObjectURL(blob);
        setImageUrlWithoutS3(imageUrl);
        setEmojiAvatar(null);
        break;

      case "emoji":
        formData.append("icon", avatar.value);
        formData.append("iconType", avatar.type);
        setImageUrlWithoutS3(null);
        setEmojiAvatar(avatar.value);
        setEmojiAvatarType(avatar.type);
        break;

      case "lucide":
        formData.append("icon", avatar.value);
        formData.append("iconType", avatar.type);
        setImageUrlWithoutS3(null);
        setEmojiAvatar(avatar.value);
        setEmojiAvatarType(avatar.type);
        break;
    }

    setIcon(formData);
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
              emojiAvatar ? { value: emojiAvatar, type: emojiAvatarType } : null
            }
            className="w-[100px]"
            emojiSize="4rem"
            imageUrlWithoutS3={imageUrlWithoutS3 ? imageUrlWithoutS3 : null}
            onAvatarChange={handleAvatarChange}
          />
        </div>
        <div>
          <Label htmlFor="name">Fotos do aplicativo *</Label>

          <Input
            className="cursor-pointer"
            placeholder="Selecione até 20 imagens"
            type="file"
            accept="image/*"
            multiple
            {...register("galeryPhotos")}
          />
        </div>
      </div>
    </>
  );
}
