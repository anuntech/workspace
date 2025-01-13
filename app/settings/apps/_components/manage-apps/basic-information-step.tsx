/* eslint-disable no-unused-vars */
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppFormData } from "./types";
import { z } from "zod";

const basicInformationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
  subtitle: z
    .string()
    .min(1, "Subtítulo é obrigatório")
    .max(100, "Subtítulo muito longo"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(500, "Descrição muito longa"),
});

interface BasicInformationStepProps {
  data: AppFormData;
  updateFormData: (
    section: keyof AppFormData,
    updates: Partial<AppFormData[keyof AppFormData]>
  ) => void;
  setStepValidation: (isValid: boolean) => void;
}

export function BasicInformationStep({
  data,
  updateFormData,
  setStepValidation,
}: BasicInformationStepProps) {
  const { name, subtitle, description } = data.basicInformation;

  const handleChange = (field: string, value: string) => {
    updateFormData("basicInformation", { [field]: value });

    // Validate the form after each change
    const validationResult = basicInformationSchema.safeParse({
      name,
      subtitle,
      description,
      ...(field === "name" ? { name: value } : {}),
      ...(field === "subtitle" ? { subtitle: value } : {}),
      ...(field === "description" ? { description: value } : {}),
    });

    setStepValidation(validationResult.success);
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
