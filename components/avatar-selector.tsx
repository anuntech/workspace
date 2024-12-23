"use client";

import { cn } from "@/lib/utils";
import { getS3Image } from "@/libs/s3-client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AvatarPopover } from "./avatar-popover";
import { IconComponent } from "./get-lucide-icons";

interface AvatarSelectorProps {
  onAvatarChange: (avatar: {
    value: string;
    type: "image" | "emoji" | "lucide";
  }) => void;
  data: { value: string; type: "image" | "emoji" | "lucide" };
  setOnLoad?: Dispatch<SetStateAction<boolean>>;
  imageUrlWithoutS3?: string;
  emojiSize?: string;
  className?: string;
}

export function AvatarSelector({
  onAvatarChange,
  data,
  imageUrlWithoutS3,
  emojiSize,
  className,
}: AvatarSelectorProps) {
  const handleAvatarChange = (newAvatar: {
    value: string;
    type: "image" | "emoji" | "lucide";
  }) => {
    onAvatarChange(newAvatar);
  };

  const renderAvatar = () => {
    if (data?.type === "emoji") {
      return (
        <div
          className="flex items-center justify-center w-full h-full"
          style={{ fontSize: emojiSize || "7rem" }}
        >
          {data.value}
        </div>
      );
    }

    if (data?.type === "lucide") {
      console.log(data.value);

      return (
        <div className="flex items-center justify-center w-full h-full">
          <IconComponent name={data.value} className="size-[7rem]" />
        </div>
      );
    }

    const src = data?.value
      ? getS3Image(data.value)
      : imageUrlWithoutS3 || "/shad.png";

    return (
      <img
        src={src}
        alt="Avatar"
        className="w-full h-full rounded-md object-cover"
      />
    );
  };

  return (
    <div className={cn("flex items-center w-full h-full", className)}>
      <div className="relative group w-full h-full flex items-center justify-center">
        {renderAvatar()}

        <div
          className="
            absolute inset-0 flex items-center justify-center 
            bg-black bg-opacity-50 opacity-0
            group-hover:opacity-100 
            rounded-md 
            transition-opacity duration-300
          "
        >
          <AvatarPopover onAvatarChange={handleAvatarChange} />
        </div>
      </div>
    </div>
  );
}
