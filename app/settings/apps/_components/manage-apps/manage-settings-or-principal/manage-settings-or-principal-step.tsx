/* eslint-disable no-unused-vars */
import { AppFormData } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrincipalOption } from "./principal-option";
import { ConfigurationOption } from "./configuration-option";

interface ManageSettingsOrPrincipalStepProps {
	data: AppFormData;
	updateFormData: (
		section: keyof AppFormData,
		updates: Partial<AppFormData[keyof AppFormData]>,
	) => void;
	isSublink?: boolean;
}

export function ManageSettingsOrPrincipalStep({
	data,
	updateFormData,
}: ManageSettingsOrPrincipalStepProps) {
	return (
		<>
			<div className="grid gap-4">
				<Tabs defaultValue="principal" className="w-[95%]">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="principal">Menu principal</TabsTrigger>
						<TabsTrigger value="settings">Menu de configurações</TabsTrigger>
					</TabsList>
					<TabsContent value="principal">
						<PrincipalOption updateFormData={updateFormData} data={data} />
					</TabsContent>
					<TabsContent value="settings">
						<ConfigurationOption updateFormData={updateFormData} data={data} />
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
}
