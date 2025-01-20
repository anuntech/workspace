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
import { LinkFormData } from "./types";
import { AddSublinkDialog } from "./add-sublink-dialog";

interface PrincipalOptionProps {
  data: LinkFormData;
  updateFormData: (
    section: keyof LinkFormData,
    updates: Partial<LinkFormData[keyof LinkFormData]>
  ) => void;
}

export function PrincipalOption({
  data,
  updateFormData,
}: PrincipalOptionProps) {
  const [sublinkToDelete, setSublinkToDelete] = useState<number | null>(null);
  const [editingSublinkIndex, setEditingSublinkIndex] = useState<number | null>(
    null
  );

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
      <div className="flex flex-col">
        <Button
          variant="ghost"
          asChild
          className="bg-gray-200 mb-1 text-gray-900 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
        >
          <div className="flex items-center justify-between  w-56 h-4">
            <Link href={``} passHref className="flex items-center">
              <div className="flex items-center justify-center">
                {data.images.emojiAvatarType === "emoji" && (
                  <p className="pointer-events-none">
                    {data.images.emojiAvatar}
                  </p>
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
        {Array.isArray(data.sublinks) &&
          data.sublinks.map((sub, index) => (
            <div key={index} className="flex w-full justify-between">
              <Button
                variant="ghost"
                className="hover:bg-gray-200 w-56 hover:text-gray-900 transition-colors duration-150 justify-start pl-10 relative before:content-['•'] before:absolute before:left-6 before:text-gray-500 h-4 py-4"
              >
                {sub.title}
              </Button>
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSublinkToDelete(index)}>
                      <Trash2 className="mr-2 size-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setEditingSublinkIndex(index)}
                    >
                      <Pencil className="mr-2 size-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    {index > 0 && (
                      <DropdownMenuItem
                        onClick={() => moveSublink(index, "up")}
                      >
                        <MoveUp className="mr-2 size-4" />
                        <span>Mover para cima</span>
                      </DropdownMenuItem>
                    )}
                    {index < data.sublinks.length - 1 && (
                      <DropdownMenuItem
                        onClick={() => moveSublink(index, "down")}
                      >
                        <MoveDown className="mr-2 size-4" />
                        <span>Mover para baixo</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

        <AddSublinkDialog data={data} updateFormData={updateFormData} />
      </div>

      {editingSublinkIndex !== null && (
        <AddSublinkDialog
          data={data}
          updateFormData={updateFormData}
          editIndex={editingSublinkIndex}
          initialValues={{
            title: data.sublinks[editingSublinkIndex].title,
            link: data.sublinks[editingSublinkIndex].link,
            type: data.sublinks[editingSublinkIndex].type,
          }}
          onClose={() => setEditingSublinkIndex(null)}
        />
      )}

      <AlertDialog
        open={sublinkToDelete !== null}
        onOpenChange={() => setSublinkToDelete(null)}
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
                if (sublinkToDelete !== null) {
                  deleteSublink(sublinkToDelete);
                }
                setSublinkToDelete(null);
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
