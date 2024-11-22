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
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";

export function FieldsDialog() {
  const [field, setField] = useState([
    {
      key: "",
      value: "",
    },
  ]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="max-w-52">Gerenciar campos</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gerenciar campos</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {field.map((f, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex gap-4">
              <Input
                placeholder="Nome do campo"
                id="key"
                defaultValue={f.key}
                className="col-span-3"
              />
              <Input
                id="username"
                defaultValue={f.value}
                className="col-span-3"
                placeholder="Link do campo"
              />
            </div>
            <Button variant="destructive">
              <X />
            </Button>
          </div>
        ))}
        <Button>
          <span>Adicionar campo</span>
          <PlusCircle />
        </Button>
        <DialogFooter>
          <Button type="submit">Salvar mudanças</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
