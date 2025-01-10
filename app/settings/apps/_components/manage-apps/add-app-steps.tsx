import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BasicInformationStep } from "./basic-information-step";
import { ImagesStep } from "./images-step";
import { GetPrincipalLink } from "./get-principal-link";
import { AppFormData } from "./types";
import { ManageSettingsOrPrincipalStep } from "./manage-settings-or-principal/manage-settings-or-principal-step";

const initialFormData: AppFormData = {
  basicInformation: {
    name: "",
    subtitle: "",
    description: "",
  },
  images: {
    icon: null,
    imageUrlWithoutS3: "",
    emojiAvatar: "",
    emojiAvatarType: "emoji",
    galleryPhotos: null,
  },
  principalLink: {
    title: "",
    link: "",
    type: "none",
  },
  sublinks: [],
};

export function AddAppStepsDialog() {
  const [data, setData] = useState<AppFormData>(initialFormData);
  console.log(data);
  const [steps, setSteps] = useState([
    {
      id: 1,
      content: BasicInformationStep,
      validation: true,
    },
    {
      id: 2,
      content: ImagesStep,
      validation: true,
    },
    {
      id: 3,
      content: GetPrincipalLink,
      validation: true,
    },
    {
      id: 4,
      content: ManageSettingsOrPrincipalStep,
      validation: true,
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const ActualStepComponent = steps[currentStep].content;

  const updateFormData = (
    section: keyof AppFormData,
    updates: Partial<AppFormData[keyof AppFormData]>
  ) => {
    setData((prev: AppFormData) => ({
      ...prev,
      [section]: Array.isArray(updates)
        ? updates
        : { ...prev[section], ...updates },
    }));
  };

  const moveSublink = (index: number, direction: "up" | "down") => {
    if (!Array.isArray(data.sublinks)) return;

    const newSublinks = [...data.sublinks];
    if (direction === "up" && index > 0) {
      [newSublinks[index], newSublinks[index - 1]] = [
        newSublinks[index - 1],
        newSublinks[index],
      ];
    } else if (direction === "down" && index < newSublinks.length - 1) {
      [newSublinks[index], newSublinks[index + 1]] = [
        newSublinks[index + 1],
        newSublinks[index],
      ];
    }

    updateFormData("sublinks", newSublinks);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setCurrentStep(0);
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          Adicionar novo aplicativo
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-lg p-6 space-y-4"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <ActualStepComponent data={data} updateFormData={updateFormData} />
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
          >
            Anterior
          </Button>
          <Button
            onClick={goToNextStep}
            disabled={
              currentStep === steps.length - 1 || !steps[currentStep].validation
            }
          >
            Próximo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
