// ApplicationItem.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { getS3Image } from "@/libs/s3-client";
import { useRef, useState } from "react";
import { ApplicationsDropdown } from "./applications-dropdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { AvatarSelector } from "@/components/avatar-selector";
import { base64ToBlob } from "@/lib/utils";

interface ApplicationItemProps {
  application: any;
}

export function ApplicationItem({ application }: ApplicationItemProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const [icon, setIcon] = useState<FormData>(null);
  const [imageUrlWithoutS3, setImageUrlWithoutS3] = useState<string>("");
  const [emojiAvatar, setEmojiAvatar] = useState<string>("");

  const editAvatarMutation = useMutation({
    mutationFn: async (data: any) => api.patch(`/api/applications/icon`, data),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["allApplications"],
        type: "all",
      });
    },
  });

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
        formData.append("applicationId", application.id);

        const imageUrl = URL.createObjectURL(blob);
        setImageUrlWithoutS3(imageUrl);
        setEmojiAvatar(null);
        break;

      case "emoji":
        formData.append("icon", avatar.value);
        formData.append("iconType", avatar.type);
        formData.append("applicationId", application.id);

        setImageUrlWithoutS3(null);
        setEmojiAvatar(avatar.value);
        break;
    }

    editAvatarMutation.mutate(formData);

    setIcon(formData);
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      <div className="relative w-20 h-20 group">
        {/* {application.avatarSrc ? (
          <div className="w-20 h-20 flex items-center justify-center">
            <img
              src={getS3Image(application.avatarSrc)}
              alt={application.name}
              className="object-cover rounded-md"
            />
          </div>
        ) : (
          <div className="bg-zinc-300 w-20 h-20 rounded-[10px] flex items-center justify-center text-[1.5rem]">
            ?
          </div>
        )} */}

        <div className="w-20 h-20 flex items-center justify-center">
          <AvatarSelector
            data={
              application?.icon
                ? application?.icon
                : {
                    type: "image",
                    value: application.avatarSrc,
                  }
            }
            onAvatarChange={handleAvatarChange}
            emojiSize="70px"
          />
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <h2 className="text-lg font-semibold">{application.name}</h2>
        <p className="text-sm text-gray-500">{application.description}</p>
      </div>
      <ApplicationsDropdown application={application} />
    </div>
  );
}
