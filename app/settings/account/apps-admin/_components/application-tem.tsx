// ApplicationItem.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { getS3Image } from "@/libs/s3-client";
import { useRef } from "react";
import { ApplicationsDropdown } from "./applications-dropdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";

interface ApplicationItemProps {
  application: any;
}

export function ApplicationItem({ application }: ApplicationItemProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const editAvatarMutation = useMutation({
    mutationFn: async (data: any) =>
      api.patch(`/api/applications/manage/${application.id}`, data),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["allApplications"],
        type: "all",
      });
    },
  });

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    console.log(`Carregando nova imagem para o aplicativo ${application.id}`);
    const formData = new FormData();

    formData.append("profilePhoto", file);

    editAvatarMutation.mutate(formData);
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      <div className="relative w-20 h-20 group">
        {application.avatarSrc ? (
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
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300">
          <Button
            variant="ghost"
            className="p-2 bg-white rounded-full shadow-lg text-black hover:bg-gray-100 transition-all duration-300"
            onClick={() => fileInputRef.current?.click()} // Simula o clique no input file
          >
            <Pencil className="w-6 h-6" />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
      </div>

      <div className="flex flex-col flex-grow">
        <h2 className="text-lg font-semibold">{application.name}</h2>
        <p className="text-sm text-gray-500">{application.description}</p>
      </div>
      <ApplicationsDropdown application={application} />
    </div>
  );
}
