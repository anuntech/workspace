"use client";

import { useQuery } from "@tanstack/react-query";
import { AvatarPopover } from "./avatar-popover";
import { Skeleton } from "@/components/ui/skeleton";
import { getS3Image } from "@/libs/s3-client";
import { useState } from "react";

interface AvatarSelectorProps {
  onAvatarChange: (avatar: { value: string; type: "image" | "emoji" }) => void;
  initialAvatar?: { value: string; type: "image" | "emoji" }; // Inicializar com valor existente
}

export function AvatarSelector({
  onAvatarChange,
  initialAvatar,
}: AvatarSelectorProps) {
  const [avatar, setAvatar] = useState(
    initialAvatar || { value: "", type: "emoji" }
  );

  const handleAvatarChange = (newAvatar: {
    value: string;
    type: "image" | "emoji";
  }) => {
    setAvatar(newAvatar);
    onAvatarChange(newAvatar); // Chama o callback com o novo avatar
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-52 h-52 group flex items-center justify-center">
        {avatar.type === "emoji" ? (
          <div className="w-52 h-52 flex items-center justify-center text-[7rem]">
            {avatar.value}
          </div>
        ) : (
          <img src={getS3Image(avatar.value)} alt="" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300">
          <AvatarPopover onAvatarChange={handleAvatarChange} />
        </div>
      </div>
    </div>
  );
}
