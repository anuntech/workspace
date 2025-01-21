import z from "zod"

export const basicInformationSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
	subtitle: z
		.string()
		.min(1, "Subtítulo é obrigatório")
		.max(100, "Subtítulo muito longo"),
	description: z
		.string()
		.min(1, "Descrição é obrigatória")
		.max(500, "Descrição muito longa"),
});

export type BasicInformationForm = z.infer<typeof basicInformationSchema>;
