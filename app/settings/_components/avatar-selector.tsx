// AvatarSelector.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { getS3Image } from "@/libs/s3-client";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { AvatarPopover } from "./avatar-popover";

interface AvatarSelectorProps {
  application: any;
}

export function AvatarSelector() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const handleFileChange = (file: File | null) => {
    if (!file) return;
  };

  return (
    <div className="flex items-center space-x-4 p-4">
      <div className="relative w-40 h-40 group">
        {false ? (
          <div className="w-40 h-40 flex items-center justify-center">
            <img src={""} alt={"Avatar"} className="object-cover rounded-md" />
          </div>
        ) : (
          <div className="bg-zinc-300 w-40 h-40 rounded-[10px] flex items-center justify-center text-[1.5rem]">
            ?
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300">
          <AvatarPopover />
        </div>

        {/* <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        /> */}
      </div>
    </div>
  );
}
