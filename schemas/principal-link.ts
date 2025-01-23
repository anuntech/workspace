import { z } from "zod";

export const principalLinkSchema = z.object({
	title: z.string().min(1, "Título é obrigatório"),
	link: z.string(),
	type: z.string(),
}).refine(
	(value) => {
		if (value.type === "none") return true;

		return value.link.length > 0 && /^https?:\/\/.*/.test(value.link);
	},
	{
		message: "Link inválido",
		path: ["link"],
	},
);

export type PrincipalLinkForm = z.infer<typeof principalLinkSchema>;
