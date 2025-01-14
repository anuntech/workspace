/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownApplication } from "@/app/(workspace)/_components/sidebar/dropdown-application";
import { IconComponent } from "@/components/get-lucide-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  MoreHorizontal,
  MoveDown,
  MoveUp,
} from "lucide-react";
import { AppFormData } from "../types";
import { AddSublinkDialog } from "./add-sublink-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface ConfigurationOptionProps {
  data: AppFormData;
  updateFormData: (
    section: keyof AppFormData,
    updates: Partial<AppFormData[keyof AppFormData]>
  ) => void;
}

export function ConfigurationOption({
  data,
  updateFormData,
}: ConfigurationOptionProps) {
  const [configurationToDelete, setConfigurationToDelete] = useState<
    number | null
  >(null);

  return (
    <>
      <Button
        variant="ghost"
        asChild
        className="bg-gray-200 mb-1 text-gray-900 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
      >
        <div className="flex items-center justify-between  w-56 h-4">
          <Link href={``} passHref className="flex items-center">
            <div className="flex items-center justify-center">
              {data.images.emojiAvatarType === "emoji" && (
                <p className="pointer-events-none">{data.images.emojiAvatar}</p>
              )}
              {data.images.emojiAvatarType === "lucide" && (
                <IconComponent
                  className="size-5 pointer-events-none"
                  name={data.images.emojiAvatar}
                />
              )}
              {data.images.emojiAvatarType === "image" && (
                <Avatar className="size-5">
                  {data.images.imageUrlWithoutS3 ? (
                    <AvatarImage
                      src={data.images.imageUrlWithoutS3}
                      alt="Avatar"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <AvatarFallback>AB</AvatarFallback>
                  )}
                </Avatar>
              )}
            </div>
            <span className="ml-3">{data.principalLink.title}</span>
          </Link>

          <div className="flex items-center gap-2">
            <DropdownApplication
              isHover={true}
              applicationId={"123"}
              className="text-muted-foreground"
            />
            {data.sublinks.length > 0 && (
              <ChevronUp className="text-muted-foreground cursor-pointer" />
            )}
          </div>
        </div>
      </Button>

      <div className="flex flex-col">
        <AddSublinkDialog data={data} updateFormData={updateFormData} />
      </div>

      <AlertDialog
        open={configurationToDelete !== null}
        onOpenChange={() => setConfigurationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente
              este sublink.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (configurationToDelete !== null) {
                  //   deleteSublink(configurationToDelete);
                }
                setConfigurationToDelete(null);
              }}
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
