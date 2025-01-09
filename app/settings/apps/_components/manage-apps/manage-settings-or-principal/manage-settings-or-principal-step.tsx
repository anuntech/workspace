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

  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

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
            <Button
              variant="ghost"
              asChild
              className="bg-gray-200 mb-1 text-gray-900 hover:bg-gray-200  hover:text-gray-900 transition-colors duration-150"
            >
              <div
                className="flex items-center justify-between w-72 h-4"
                ref={buttonRef}
              >
                <Link href={``} passHref className="flex items-center">
                  <div className="flex  items-center justify-center">
                    {data.images.emojiAvatarType === "emoji" && (
                      <p className=" pointer-events-none">
                        {data.images.emojiAvatar}
                      </p>
                    )}
                    {data.images.emojiAvatarType === "lucide" && (
                      <IconComponent
                        className="size-5 pointer-events-none"
                        name={data.images.emojiAvatar}
                      />
                    )}
                    {(data.images.emojiAvatarType === "image" ||
                      !data.images.emojiAvatar) && (
                      <Avatar className="size-5">
                        <AvatarImage
                          src={getS3Image(data.images.emojiAvatar)}
                        />
                        <AvatarFallback>AB</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <span className="ml-3">{data.principalLink.title}</span>
                </Link>

                <div className="flex items-center gap-2">
                  <DropdownApplication
                    isHover={true}
                    applicationId={"123"}
                    className="text-muted-foreground"
                  />
                  {data.sublinks.length > 0 && (
                    <ChevronUp className="text-muted-foreground cursor-pointer" />
                  )}
                </div>
              </div>
            </Button>

            <div className="flex flex-col gap-5">
              {data.sublinks.map((sub, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="hover:bg-gray-200 w-72 hover:text-gray-900 transition-colors duration-150 justify-start pl-10 relative before:content-['•'] before:absolute before:left-6 before:text-gray-500 h-4 py-4"
                >
                  {sub.title}
                </Button>
              ))}

              <Button variant="outline" className="w-48 mt-4">
                Adicionar sublink
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="settings">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </>
  );
}
