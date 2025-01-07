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

export function ImagesStep() {
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
        <DialogTitle>Coloque fotos para seu aplicativo</DialogTitle>
        <DialogDescription>
          Ajude as pessoas indentificar ser aplicativo
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
      </div>
    </>
  );
}
