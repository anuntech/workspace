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
  X,
} from "lucide-react";
import { AppFormData } from "../types";
import { AddConfigurationDialog } from "./add-configuration-dialog";
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
      <div className="flex flex-col space-y-2">
        {data.configurationOptions.map((config, index) => (
          <Button
            key={index}
            variant="ghost"
            asChild
            className="bg-gray-200 mb-1 text-gray-900 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
          >
            <div className="flex items-center justify-between w-56 h-4">
              <Link href={config.link} passHref className="flex items-center">
                <span className="ml-3">{config.title}</span>
              </Link>
              <div>
                <Button size="icon" variant="ghost">
                  <Pencil className="text-muted-foreground cursor-pointer" />
                </Button>
                <Button size="icon" variant="ghost">
                  <X className="text-muted-foreground cursor-pointer" />
                </Button>
              </div>
            </div>
          </Button>
        ))}

        <div className="flex flex-col">
          <AddConfigurationDialog data={data} updateFormData={updateFormData} />
        </div>
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
