import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AppFormData } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ManageSettingsOrPrincipalStepProps {
  data: AppFormData;
  updateFormData: (
    section: keyof AppFormData,
    updates: Partial<AppFormData[keyof AppFormData]>
  ) => void;
  isSublink?: boolean;
}

export function ManageSettingsOrPrincipalStep({
  data,
  updateFormData,
  isSublink,
}: ManageSettingsOrPrincipalStepProps) {
  const { title, link, type } = data.principalLink;

  const handleChange = (field: string, value: string) => {
    updateFormData("principalLink", { [field]: value });
  };

  return (
    <>
      {/* <DialogHeader>
        <DialogTitle>
          Adicionar {!isSublink ? "link principal" : "sublink"} ao aplicativo
        </DialogTitle>
        <DialogDescription>
          Adicione o {!isSublink ? "link principal" : "sublink"} do aplicativo,
          que será o link que o usuário irá usar para acessar a tela principal
          do aplicativo.
        </DialogDescription>
      </DialogHeader> */}
      <div className="grid gap-4">
        <Tabs defaultValue="principal" className="w-[95%]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="principal">Menu principal</TabsTrigger>
            <TabsTrigger value="settings">Menu de configurações</TabsTrigger>
          </TabsList>
          <TabsContent value="principal">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="settings">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </>
  );
}
