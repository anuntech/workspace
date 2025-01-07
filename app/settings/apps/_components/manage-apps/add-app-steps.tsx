import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BasicInformationStep } from "./basic-information-step";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ImagesStep } from "./images-step";

const initialSteps = [
  {
    id: 1,
    content: BasicInformationStep,
    validation: false,
  },
  {
    id: 2,
    content: ImagesStep,
    validation: false,
  },
];

export function AddAppStepsDialog() {
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);

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

  const setValidationByStep = (validation: boolean) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, index) =>
        index === currentStep ? { ...step, validation } : step
      )
    );
  };

  const ActualStepComponent = steps[currentStep].content;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Adicionar novo aplicativo</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-6 space-y-4">
        <ActualStepComponent />
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
              currentStep === steps.length - 1 && !steps[currentStep].validation
            }
          >
            Próximo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
