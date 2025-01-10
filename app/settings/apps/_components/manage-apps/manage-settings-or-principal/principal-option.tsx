/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownApplication } from "@/app/(workspace)/_components/sidebar/dropdown-application";
import { IconComponent } from "@/components/get-lucide-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getS3Image } from "@/libs/s3-client";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
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

interface PrincipalOptionProps {
  data: AppFormData;
  updateFormData: (
    section: keyof AppFormData,
    updates: Partial<AppFormData[keyof AppFormData]>
  ) => void;
}

export function PrincipalOption({
  data,
  updateFormData,
}: PrincipalOptionProps) {
  const moveSublink = (index: number, direction: "up" | "down") => {
    if (!Array.isArray(data.sublinks)) return;

    const newSublinks = [...data.sublinks];
    if (direction === "up" && index > 0) {
      [newSublinks[index], newSublinks[index - 1]] = [
        newSublinks[index - 1],
        newSublinks[index],
      ];
    } else if (direction === "down" && index < newSublinks.length - 1) {
      [newSublinks[index], newSublinks[index + 1]] = [
        newSublinks[index + 1],
        newSublinks[index],
      ];
    }

    updateFormData("sublinks", newSublinks);
  };

  const deleteSublink = (index: number) => {
    if (!Array.isArray(data.sublinks)) return;
    const newSublinks = data.sublinks.filter((_, i) => i !== index);
    updateFormData("sublinks", newSublinks);
  };

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
              {(data.images.emojiAvatarType === "image" ||
                !data.images.emojiAvatar) && (
                <Avatar className="size-5">
                  <AvatarImage src={getS3Image(data.images.emojiAvatar)} />
                  <AvatarFallback>AB</AvatarFallback>
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
        {Array.isArray(data.sublinks) &&
          data.sublinks.map((sub, index) => (
            <div key={index} className="flex">
              <Button
                variant="ghost"
                className="hover:bg-gray-200 w-56 hover:text-gray-900 transition-colors duration-150 justify-start pl-10 relative before:content-['•'] before:absolute before:left-6 before:text-gray-500 h-4 py-4"
              >
                {sub.title}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost">
                    <Trash2 className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá
                      permanentemente este sublink.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteSublink(index)}>
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="ghost">
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => moveSublink(index, "up")}
                disabled={index === 0}
              >
                <ChevronUp className="size-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => moveSublink(index, "down")}
                disabled={index === data.sublinks.length - 1}
              >
                <ChevronDown className="size-4" />
              </Button>
            </div>
          ))}

        <AddSublinkDialog data={data} updateFormData={updateFormData} />
      </div>
    </>
  );
}
