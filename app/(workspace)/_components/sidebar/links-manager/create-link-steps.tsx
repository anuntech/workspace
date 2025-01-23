"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { toast } from "@/hooks/use-toast";
import { LinkFormData } from "./types";
import { Plus } from "lucide-react";
import { BasicLinkInformation } from "./basic-link-informations";
import { PrincipalOption } from "./principal-option";
import { useSearchParams } from "next/navigation";

const initialFormData: LinkFormData = {
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

export function CreateLinkStepsDialog() {
	const urlParams = useSearchParams();
	const workspaceId = urlParams.get("workspace");
	const [data, setData] = useState<LinkFormData>(initialFormData);
	const [steps, setSteps] = useState([
		{
			id: 1,
			content: BasicLinkInformation,
			validation: false,
		},
		{
			id: 2,
			content: PrincipalOption,
			validation: true,
		},
	]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const saveLinkMutation = useMutation({
		mutationFn: async (data: FormData) => api.post("/api/workspace/link", data),
		onSuccess: async () => {
			await queryClient.refetchQueries({
				queryKey: ["workspace"],
				type: "all",
			});
			await queryClient.refetchQueries({
				queryKey: ["workspace/links"],
				type: "all",
			});
			toast({
				description: "Link salvo com sucesso.",
				duration: 5000,
			});
			setIsOpen(false);
			setData(initialFormData);
			setCurrentStep(0);
		},
		onError: () => {
			toast({
				description: "Algo deu errado ao salvar o aplicativo.",
				duration: 5000,
				variant: "destructive",
			});
		},
	});

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
		section: keyof LinkFormData,
		updates: Partial<LinkFormData[keyof LinkFormData]>
	) => {
		setData((prev: LinkFormData) => ({
			...prev,
			[section]: Array.isArray(updates)
				? updates
				: { ...prev[section], ...updates },
		}));
	};

	const setStepValidation = (isValid: boolean) => {
		setSteps((prev) =>
			prev.map((step, idx) =>
				idx === currentStep ? { ...step, validation: isValid } : step
			)
		);
	};

	const handleSave = () => {
		const formData = new FormData();

		formData.append("url", data.principalLink.link || "");
		formData.append("urlType", data.principalLink.type || "");

		// Images
		if (!data.images.icon) {
			toast({
				title: "É necessário selecionar um avatar!",
				variant: "destructive",
				duration: 3000,
			});
			return;
		}

		formData.append("icon", data.images.icon.get("icon"));
		formData.append("iconType", data.images.emojiAvatarType);

		formData.append(
			"fields",
			JSON.stringify(
				data.sublinks.map((sub) => ({
					key: sub.title,
					value: sub.link,
					redirectType: sub.type,
				}))
			)
		);
		formData.append("workspaceId", workspaceId);
		formData.append("title", data.principalLink.title);

		saveLinkMutation.mutate(formData);
	};

	const setInitialSteps = () => {
		setSteps((prev) =>
			prev.map((step) => {
				return {
					...step,
					validation: step.id == 2, // Only the last step is validated
				};
			})
		);
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				if (!open) {
					setData(initialFormData);
					setCurrentStep(0);
					setInitialSteps();
				}
			}}
		>
			<DialogTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					className="text-muted-foreground -mr-[0.15rem]"
				>
					<Plus />
				</Button>
			</DialogTrigger>
			<DialogContent
				className="max-w-lg p-6 space-y-4"
				onInteractOutside={(event) => event.preventDefault()}
			>
				<ActualStepComponent
					data={data}
					updateFormData={updateFormData}
					setStepValidation={setStepValidation}
				/>
				<div className="flex justify-between mt-4">
					<Button
						variant="outline"
						onClick={goToPreviousStep}
						disabled={currentStep === 0}
					>
						Anterior
					</Button>
					{currentStep === steps.length - 1 ? (
						<Button
							onClick={handleSave}
							disabled={
								!steps[currentStep].validation || saveLinkMutation.isPending
							}
						>
							{saveLinkMutation.isPending ? "Salvando..." : "Salvar"}
						</Button>
					) : (
						<Button
							onClick={goToNextStep}
							disabled={!steps[currentStep].validation}
						>
							Próximo
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
