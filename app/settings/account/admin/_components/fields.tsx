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
  const [fields, setFields] = useState([
    {
      key: "",
      value: "",
    },
  ]);

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

  const saveChanges = () => {
    console.log("Saved fields:", fields);
  };

  return (
    <Dialog>
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
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Key"
                value={field.key}
                onChange={(e) => updateField(index, "key", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value"
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
          <Button
            onClick={addField}
            className="w-full flex items-center justify-center gap-2"
          >
            <PlusCircle />
            <span>Adicionar campo</span>
          </Button>
        </div>
        <DialogFooter>
          <Button type="button" onClick={saveChanges}>
            Salvar mudanças
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
