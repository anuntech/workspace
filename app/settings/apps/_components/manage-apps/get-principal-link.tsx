import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AppFormData } from "./types";

interface GetPrincipalLinkProps {
  data: AppFormData;
  updateFormData: (
    section: keyof AppFormData,
    updates: Partial<AppFormData[keyof AppFormData]>
  ) => void;
  isSublink?: boolean;
}

export function GetPrincipalLink({
  data,
  updateFormData,
  isSublink,
}: GetPrincipalLinkProps) {
  const { title, link, type } = data.principalLink;

  const handleChange = (field: string, value: string) => {
    updateFormData("principalLink", { [field]: value });
  };

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
          <Input
            id="title"
            placeholder="Coloque um nome para o aplicativo"
            value={title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="link">Link do aplicativo *</Label>
          <Input
            id="link"
            placeholder="https://seu-aplicativo.com"
            value={link}
            onChange={(e) => handleChange("link", e.target.value)}
          />
        </div>
        <div className="space-y-4">
          <Label htmlFor="type">
            Tipo de {!isSublink ? "link" : "sublink"} *
          </Label>
          <RadioGroup
            value={type}
            onValueChange={(value) => handleChange("type", value)}
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
              <RadioGroupItem value="sameWindow" id="r3" />
              <Label htmlFor="r3">Mesma janela</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </>
  );
}
