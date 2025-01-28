"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { EmailForm, emailSchema } from "@/schemas/email";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SignInWithEmailForm({ csrfToken }: { csrfToken: string }) {
	const [isLoading, setIsLoading] = useState(true);

	const searchParams = useSearchParams();

	const email = searchParams.get("email") || "";

	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
	} = useForm<EmailForm>({
		defaultValues: {
			email,
		},
		resolver: zodResolver(emailSchema),
	});

	useEffect(() => {
		setIsLoading(false);
	}, []);

	async function onSubmit(data: EmailForm) {
		try {
			sessionStorage.setItem("email", data.email);

			await signIn("email", { email: data.email });
		} catch (error) {
			console.error("Erro ao enviar e-mail:", error);
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
			<input name="csrfToken" type="hidden" defaultValue={csrfToken} />
			<div>
				<Input
					type="text"
					placeholder="exemplo@company.com"
					{...register("email")}
					className="py-6"
					disabled={isSubmitting || isLoading}
				/>
				{errors.email && (
					<p className="text-red-500 text-sm mt-1">
						{errors.email.message.toString()}
					</p>
				)}
			</div>
			<Button
				type="submit"
				disabled={!isValid || isSubmitting || isSubmitSuccessful}
				className="w-full py-6 flex items-center justify-center"
			>
				{(isSubmitting || isSubmitSuccessful) && (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				)}
				Continuar com o e-mail
			</Button>
		</form>
	);
}
