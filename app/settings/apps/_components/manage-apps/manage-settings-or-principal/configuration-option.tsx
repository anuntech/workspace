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
  const [editingConfigIndex, setEditingConfigIndex] = useState<number | null>(
    null
  );

  const deleteConfiguration = (index: number) => {
    if (!Array.isArray(data.configurationOptions)) return;
    const newConfigs = data.configurationOptions.filter((_, i) => i !== index);
    updateFormData("configurationOptions", newConfigs);
  };

  return (
    <>
      <div className="flex flex-col space-y-2">
        {data.configurationOptions.map((config, index) => (
          <div key={index} className="flex w-full justify-between">
            <Button
              variant="ghost"
              asChild
              className="bg-gray-200 mb-1 text-gray-900 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
            >
              <div className="flex items-center justify-between w-56 h-4">
                <Link href={config.link} passHref className="flex items-center">
                  <span className="ml-3">{config.title}</span>
                </Link>
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setConfigurationToDelete(index)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setEditingConfigIndex(index)}
                      >
                        <Pencil className="mr-2 size-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Button>
          </div>
        ))}

        <div className="flex flex-col">
          <AddConfigurationDialog data={data} updateFormData={updateFormData} />
        </div>
      </div>

      {editingConfigIndex !== null && (
        <AddConfigurationDialog
          data={data}
          updateFormData={updateFormData}
          editIndex={editingConfigIndex}
          initialValues={{
            title: data.configurationOptions[editingConfigIndex].title,
            link: data.configurationOptions[editingConfigIndex].link,
            type: data.configurationOptions[editingConfigIndex].type,
          }}
          onClose={() => setEditingConfigIndex(null)}
        />
      )}

      <AlertDialog
        open={configurationToDelete !== null}
        onOpenChange={() => setConfigurationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente
              esta configuração.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (configurationToDelete !== null) {
                  deleteConfiguration(configurationToDelete);
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
