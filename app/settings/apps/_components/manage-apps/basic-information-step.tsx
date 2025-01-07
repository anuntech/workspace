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

export function BasicInformationStep() {
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");

  const isFormValid =
    name.trim() !== "" && subtitle.trim() !== "" && description.trim() !== "";

  const handleSave = () => {
    if (isFormValid) {
      console.log("Aplicativo salvo:", { name, subtitle, description });
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
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
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="subtitle">Subtítulo do aplicativo *</Label>
          <Input
            id="subtitle"
            placeholder='"Seu aplicativo de produtividade"'
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="description">Descrição do aplicativo *</Label>
          <Textarea
            id="description"
            placeholder="Um aplicativo feito para te ajudar na sua produtividade"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
