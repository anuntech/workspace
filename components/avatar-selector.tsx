"use client";

import { AvatarPopover } from "./avatar-popover";
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
  const [changed, setChanged] = useState(false);

  const handleAvatarChange = (newAvatar: {
    value: string;
    type: "image" | "emoji";
  }) => {
    setChanged(true);
    onAvatarChange(newAvatar);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-52 h-52 group flex items-center justify-center">
        {initialAvatar.type === "emoji" ? (
          <div className="w-52 h-52 flex items-center justify-center text-[7rem]">
            {initialAvatar.value}
          </div>
        ) : (
          <img src={getS3Image(initialAvatar.value)} alt="" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300">
          <AvatarPopover onAvatarChange={handleAvatarChange} />
        </div>
      </div>
    </div>
  );
}
