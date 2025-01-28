import { z } from "zod";

export const emailSchema = z.object({
	email: z
		.string()
		.min(
			1,
			"O campo de e-mail não pode estar vazio. Por favor, preencha-o antes de continuar.",
		)
		.email(
			"Por favor, insira um endereço de e-mail válido no formato: exemplo@dominio.com.",
		)
		.max(
			254,
			"O endereço de e-mail excede o limite de 254 caracteres. Insira um e-mail mais curto.",
		),
});

export type EmailForm = z.infer<typeof emailSchema>;
