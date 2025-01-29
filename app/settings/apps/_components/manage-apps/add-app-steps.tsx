import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BasicInformationStep } from "./basic-information-step";
import { ImagesStep } from "./images-step";
import { GetPrincipalLink } from "./get-principal-link";
import { AppFormData } from "./types";
import { ManageSettingsOrPrincipalStep } from "./manage-settings-or-principal/manage-settings-or-principal-step";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { toast } from "@/hooks/use-toast";

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
	workspaceAllowed: [],
	configurationOptions: [],
};

export function AddAppStepsDialog() {
	const [data, setData] = useState<AppFormData>(initialFormData);
	const [steps, setSteps] = useState([
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
		{
			id: 3,
			content: GetPrincipalLink,
			validation: false,
		},
		{
			id: 4,
			content: ManageSettingsOrPrincipalStep,
			validation: true,
		},
	]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const saveApplicationMutation = useMutation({
		mutationFn: async (data: FormData) => {
			const response = await api.post("/api/applications", data);

			return response.data;
		},
		onSuccess: () => {
			queryClient.refetchQueries({
				queryKey: ["applications"],
				type: "all",
			});
			queryClient.refetchQueries({
				queryKey: ["workspace"],
				type: "all",
			});
			toast({
				description: "Aplicativo salvo com sucesso.",
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
		section: keyof AppFormData,
		updates: Partial<AppFormData[keyof AppFormData]>,
	) => {
		setData((prev: AppFormData) => ({
			...prev,
			[section]: Array.isArray(updates)
				? updates
				: { ...prev[section], ...updates },
		}));
	};

	const setStepValidation = (isValid: boolean) => {
		setSteps((prev) =>
			prev.map((step, idx) =>
				idx === currentStep ? { ...step, validation: isValid } : step,
			),
		);
	};

	const handleSave = () => {
		const formData = new FormData();

		formData.append("name", data.basicInformation.name);
		formData.append("subtitle", data.basicInformation.subtitle);
		formData.append("description", data.basicInformation.description);
		formData.append("cta", data.basicInformation.subtitle || "");
		formData.append("title", data.basicInformation.name || "");
		formData.append("iframeUrl", data.principalLink.link || "");
		formData.append("applicationUrlType", data.principalLink.type || "");
		formData.append(
			"configurationOptions",
			JSON.stringify(data.configurationOptions),
		);

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

		if (data.images.galleryPhotos && data.images.galleryPhotos.length > 0) {
			Array.from(data.images.galleryPhotos).forEach((file) => {
				formData.append("galeryPhotos", file);
			});
		}

		formData.append("workspacesAllowed", JSON.stringify(data.workspaceAllowed));
		formData.append(
			"fields",
			JSON.stringify(
				data.sublinks.map((sub) => ({
					key: sub.title,
					value: sub.link,
					redirectType: sub.type,
				})),
			),
		); // Adding empty fields array to match structure
		formData.append("category", "free");

		saveApplicationMutation.mutate(formData);
	};

	const setInitialSteps = () => {
		setSteps((prev) =>
			prev.map((step) => {
				return {
					...step,
					validation: step.id == 4, // Only the last step is validated
				};
			}),
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
				<Button onClick={() => setIsOpen(true)}>
					Adicionar novo aplicativo
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
								!steps[currentStep].validation ||
								saveApplicationMutation.isPending
							}
						>
							{saveApplicationMutation.isPending ? "Salvando..." : "Salvar"}
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
