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

export function FieldsDialog({
  handleSave,
}: {
  handleSave?: (fields: { key: string; value: string }[]) => void;
}) {
  const [fields, setFields] = useState([
    {
      key: "",
      value: "",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const addField = () => {
    setFields([...fields, { key: "", value: "" }]);
  };

  const removeField = (index: number) => {
    if (fields.length === 1) {
      setFields([{ key: "", value: "" }]);
      return;
    }
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const updateField = (index: number, type: "key" | "value", value: string) => {
    const updatedFields = [...fields];
    updatedFields[index][type] = value;
    setFields(updatedFields);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="max-w-52">Gerenciar campos</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gerenciar campos</DialogTitle>
          <DialogDescription>
            Manage your custom fields. Add or remove fields and click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-auto">
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Campo"
                value={field.key}
                onChange={(e) => updateField(index, "key", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Valor"
                value={field.value}
                onChange={(e) => updateField(index, "value", e.target.value)}
                className="flex-1"
              />
              <Button
                variant="destructive"
                onClick={() => removeField(index)}
                className="p-2"
                aria-label="Remove field"
              >
                <X />
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter className="flex sm:justify-between sm:items-start w-full">
          <Button
            onClick={addField}
            className="flex items-center justify-center gap-2"
          >
            <PlusCircle />
            <span>Adicionar campo</span>
          </Button>
          <Button
            type="button"
            onClick={() => {
              handleSave?.(fields);
              setIsOpen(false);
            }}
          >
            Salvar mudanças
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
