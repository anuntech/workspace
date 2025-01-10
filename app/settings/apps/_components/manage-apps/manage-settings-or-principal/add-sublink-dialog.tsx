/* eslint-disable no-unused-vars */
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AppFormData } from "../types";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddSublinkDialogProps {
  data: AppFormData;
  updateFormData: (
    section: keyof AppFormData,
    updates: Partial<AppFormData[keyof AppFormData]>
  ) => void;
}

const sublinkSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  link: z.string().url("Link inválido").min(1, "Link é obrigatório"),
  type: z.enum(["none", "iframe", "newWindow", "sameWindow"]),
});

type SublinkForm = z.infer<typeof sublinkSchema>;

export function AddSublinkDialog({
  data,
  updateFormData,
}: AddSublinkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<SublinkForm>({
    resolver: zodResolver(sublinkSchema),
    defaultValues: {
      title: "",
      link: "",
      type: "none",
    },
  });

  const onSubmit = (values: SublinkForm) => {
    const newSublink = {
      title: values.title,
      link: values.link,
      type: values.type,
    };

    updateFormData("sublinks", [...(data.sublinks || []), newSublink]);
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-48">
          Adicionar sublink
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>Adicionar sublink ao aplicativo</DialogTitle>
          <DialogDescription>
            Adicione um sublink ao aplicativo, que será exibido abaixo do link
            principal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <Label htmlFor="title">Título do sublink *</Label>
            <Input
              id="title"
              placeholder="Nome do sublink"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <span className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="link">Link do sublink *</Label>
            <Input
              id="link"
              placeholder="https://seu-aplicativo.com/sublink"
              {...form.register("link")}
            />
            {form.formState.errors.link && (
              <span className="text-sm text-red-500">
                {form.formState.errors.link.message}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <Label htmlFor="type">Tipo de sublink *</Label>
            <RadioGroup
              value={form.watch("type")}
              onValueChange={(value) => form.setValue("type", value as any)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="r1" />
                <Label htmlFor="r1">Nenhum</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="iframe" id="r2" />
                <Label htmlFor="r2">Iframe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newWindow" id="r3" />
                <Label htmlFor="r3">Nova janela</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sameWindow" id="r4" />
                <Label htmlFor="r4">Mesma janela</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end mt-4">
            <Button type="submit">Adicionar sublink</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
