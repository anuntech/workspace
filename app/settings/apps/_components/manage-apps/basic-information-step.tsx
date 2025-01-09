import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppFormData } from "./types";

interface BasicInformationStepProps {
  data: AppFormData;
  updateFormData: (
    section: keyof AppFormData,
    updates: Partial<AppFormData[keyof AppFormData]>
  ) => void;
}

export function BasicInformationStep({
  data,
  updateFormData,
}: BasicInformationStepProps) {
  const { name, subtitle, description } = data.basicInformation;

  const handleChange = (field: string, value: string) => {
    updateFormData("basicInformation", { [field]: value });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Adicionar aplicativo</DialogTitle>
        <DialogDescription>
          Adicione um aplicativo na Loja da Anuntech preenchendo os campos
          abaixo.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Nome do aplicativo *</Label>
          <Input
            id="name"
            placeholder="Coloque um nome para o aplicativo"
            value={name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="subtitle">Subtítulo do aplicativo *</Label>
          <Input
            id="subtitle"
            placeholder='"Seu aplicativo de produtividade"'
            value={subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="description">Descrição do aplicativo *</Label>
          <Textarea
            id="description"
            placeholder="Um aplicativo feito para te ajudar na sua produtividade"
            value={description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
