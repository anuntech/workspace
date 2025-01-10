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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownApplication } from "@/app/(workspace)/_components/sidebar/dropdown-application";
import { AccordionTrigger } from "@/components/ui/accordion";
import { useRef, useState } from "react";
import { IconComponent } from "@/components/get-lucide-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getS3Image } from "@/libs/s3-client";
import { ChevronUp } from "lucide-react";
import { PrincipalOption } from "./principal-option";

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
      <div className="grid gap-4">
        <Tabs defaultValue="principal" className="w-[95%]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="principal">Menu principal</TabsTrigger>
            <TabsTrigger value="settings">Menu de configurações</TabsTrigger>
          </TabsList>
          <TabsContent value="principal">
            <PrincipalOption data={data} />
          </TabsContent>
          <TabsContent value="settings">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </>
  );
}
