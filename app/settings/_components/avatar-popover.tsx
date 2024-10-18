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
import api from "@/libs/api";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import ImageEditor from "@/components/image-crop";
import { cn } from "@/lib/utils";

export function AvatarPopover() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null); // Para armazenar a imagem recortada
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null); // Para armazenar o URL da imagem recortada
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string); // Definindo o src da imagem selecionada
      };
      reader.readAsDataURL(file);
    }
  };

  const workspaceId = useSearchParams().get("workspace");

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const changeWorkspaceAvatarMutation = useMutation({
    mutationFn: async (data: any) => api.patch(`/api/workspace/icon`, data),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["workspace"],
        type: "all",
      });
      toast({
        title: "Avatar atualizado",
        description: "O avatar do workspace foi alterado com sucesso.",
        duration: 5000,
      });
      setOpen(false);
      setCroppedImageBlob(null);
      setCroppedImageUrl(null);
      setSelectedImage(null);
    },
    onError: async (error) => {
      toast({
        title: "Erro ao atualizar avatar",
        description:
          "Ocorreu um erro ao atualizar o avatar do workspace. O limite do arquivo é de 10MB.",
        duration: 5000,
        variant: "destructive",
      });
      setCroppedImageBlob(null);
      setCroppedImageUrl(null);
      setSelectedImage(null);
    },
  });

  // Função para salvar a imagem recortada
  const handleSaveCroppedImage = (croppedImage: Blob) => {
    setCroppedImageBlob(croppedImage); // Salvando a imagem recortada como Blob
    const croppedImageUrl = URL.createObjectURL(croppedImage); // Criando URL temporário da imagem recortada
    setCroppedImageUrl(croppedImageUrl); // Armazenando URL para exibição
  };

  const handleSaveImage = async () => {
    if (croppedImageBlob) {
      const formData = new FormData();
      formData.append("icon", croppedImageBlob, "avatar.jpeg");
      formData.append("iconType", "image");
      formData.append("workspaceId", workspaceId);
      changeWorkspaceAvatarMutation.mutate(formData);
    }
  };

  const handleSaveEmoji = (e: any) => {
    console.log(e);
    const formData = new FormData();
    formData.append("icon", e.native);
    formData.append("iconType", "emoji");
    formData.append("workspaceId", workspaceId);
    changeWorkspaceAvatarMutation.mutate(formData);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
                  onEmojiSelect={(e: any) => handleSaveEmoji(e)}
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
                          src={croppedImageUrl!} // Exibe a imagem recortada
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
                    disabled={changeWorkspaceAvatarMutation.isPending} // Habilita o botão apenas se houver uma imagem recortada
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
