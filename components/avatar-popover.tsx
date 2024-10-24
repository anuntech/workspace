import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil } from "lucide-react";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import ImageEditor from "@/components/image-crop";
import { cn } from "@/lib/utils";

interface AvatarPopoverProps {
  onAvatarChange: (avatar: { value: string; type: "image" | "emoji" }) => void;
}

export function AvatarPopover({ onAvatarChange }: AvatarPopoverProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const [open, setOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCroppedImage = (croppedImage: Blob) => {
    setCroppedImageBlob(croppedImage);
    const croppedImageUrl = URL.createObjectURL(croppedImage);
    setCroppedImageUrl(croppedImageUrl);
  };

  const handleSaveImage = async () => {
    if (croppedImageBlob) {
      const formData = new FormData();
      formData.append("icon", croppedImageBlob, "avatar.jpeg");

      const reader = new FileReader();
      reader.onload = () => {
        onAvatarChange({
          value: reader.result as string,
          type: "image",
        });
        setOpen(false);
      };
      reader.readAsDataURL(croppedImageBlob);
    }
  };

  const handleSaveEmoji = (emoji: any) => {
    onAvatarChange({ value: emoji.native, type: "emoji" });
    setOpen(false);
  };

  const handleSetOpen = () => {
    setOpen(!open);
    if (open) {
      setCroppedImageBlob(null);
      setCroppedImageUrl(null);
      setSelectedImage(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleSetOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="p-2 bg-white rounded-full shadow-lg text-black hover:bg-gray-100 transition-all duration-300"
        >
          <Pencil className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-6 rounded-lg shadow-lg border border-gray-200 bg-white">
        <div className="grid gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">
              Escolha um avatar
            </h4>
            <Tabs defaultValue="emojis">
              <TabsList className="flex justify-center bg-gray-100 rounded-lg p-1">
                <TabsTrigger
                  value="emojis"
                  className="w-1/2 text-center py-2 text-sm font-medium text-gray-700 hover:bg-white rounded-lg transition-all"
                >
                  Emojis
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className="w-1/2 text-center py-2 text-sm font-medium text-gray-700 hover:bg-white rounded-lg transition-all"
                >
                  Personalizado
                </TabsTrigger>
              </TabsList>
              <TabsContent value="emojis" className="pt-4">
                <Picker
                  data={emojiData}
                  onEmojiSelect={handleSaveEmoji}
                  theme="light"
                />
              </TabsContent>
              <TabsContent value="upload" className="pt-4">
                <div className="flex flex-col items-center gap-6">
                  <label className="relative group cursor-pointer">
                    {selectedImage && !croppedImageBlob ? (
                      <div className="h-72 w-72">
                        <ImageEditor
                          imageSrc={selectedImage}
                          onCropComplete={handleSaveCroppedImage}
                        />
                      </div>
                    ) : croppedImageBlob ? (
                      <div className="h-72 w-72">
                        <Image
                          src={croppedImageUrl!}
                          alt="Cropped Image"
                          width={288}
                          height={288}
                          className="rounded-[10px] shadow-lg"
                          onClick={() => {
                            setCroppedImageBlob(null);
                            setCroppedImageUrl(null);
                            setSelectedImage(null);
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-full group-hover:bg-gray-100 transition-all">
                          <span className="text-sm text-gray-500 group-hover:text-gray-700">
                            Selecione uma imagem
                          </span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </>
                    )}
                  </label>
                  <Button
                    onClick={handleSaveImage}
                    disabled={!croppedImageBlob}
                    className={cn(
                      "px-6 py-2 rounded-lg shadow-lg transition-all duration-300",
                      selectedImage && !croppedImageBlob && "hidden"
                    )}
                  >
                    Salvar
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
