"use client";

import { cn } from "@/lib/utils";
import { getS3Image } from "@/libs/s3-client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AvatarPopover } from "./avatar-popover";

interface AvatarSelectorProps {
  onAvatarChange: (avatar: { value: string; type: "image" | "emoji" }) => void;
  data: { value: string; type: "image" | "emoji" };
  setOnLoad?: Dispatch<SetStateAction<boolean>>;
  imageUrlWithoutS3?: string;
  emojiSize?: string; // px rem ...
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
    type: "image" | "emoji";
  }) => {
    onAvatarChange(newAvatar);
  };

  return (
    <div className={cn("flex items-center space-x-4 w-full h-full", className)}>
      <div className="relative w-full h-full group flex items-center justify-center">
        {data?.type === "emoji" ? (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ fontSize: emojiSize || "7rem" }}
          >
            {data?.value}
          </div>
        ) : !imageUrlWithoutS3 && data?.value ? (
          <img
            src={getS3Image(data?.value)}
            alt=""
            className="w-full rounded-md h-full"
          />
        ) : (
          <img
            src={imageUrlWithoutS3 || "/shad.png"}
            alt=""
            className="w-full rounded-md h-full"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300">
          <AvatarPopover onAvatarChange={handleAvatarChange} />
        </div>
      </div>
    </div>
  );
}
