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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function GetLink({ isSublink }: { isSublink?: boolean }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Adicionar {!isSublink ? "link principal" : "sublink"} ao aplicativo
        </DialogTitle>
        <DialogDescription>
          Adicione o {!isSublink ? "link principal" : "sublink"} do aplicativo,
          que será o link que o usuário irá usar para acessar a tela principal
          do aplicativo.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input id="title" placeholder="Coloque um nome para o aplicativo" />
        </div>
        <div>
          <Label htmlFor="link">Subtítulo do aplicativo *</Label>
          <Input id="link" placeholder='"Seu aplicativo de produtividade"' />
        </div>
        <div className="space-y-4">
          <Label htmlFor="type">
            Tipo de {!isSublink ? "link" : "sublink"} *
          </Label>
          <RadioGroup defaultValue="comfortable" className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Default</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Comfortable</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Compact</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </>
  );
}
