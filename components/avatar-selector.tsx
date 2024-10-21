"use client";

import { AvatarPopover } from "./avatar-popover";
import { getS3Image } from "@/libs/s3-client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface AvatarSelectorProps {
  onAvatarChange: (avatar: { value: string; type: "image" | "emoji" }) => void;
  data: { value: string; type: "image" | "emoji" };
  setOnLoad?: Dispatch<SetStateAction<boolean>>;
}

export function AvatarSelector({
  onAvatarChange,
  data,
  setOnLoad,
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
        {data.type === "emoji" ? (
          <div className="w-52 h-52 flex items-center justify-center text-[7rem]">
            {data.value}
          </div>
        ) : (
          <img
            onLoad={() => setOnLoad(true)}
            src={getS3Image(data.value)}
            alt=""
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300">
          <AvatarPopover onAvatarChange={handleAvatarChange} />
        </div>
      </div>
    </div>
  );
}
