"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StatusPage() {
	const [email, setEmail] = useState<string | null>(null);

	useEffect(() => {
		const email = sessionStorage.getItem("email");

		setEmail(email);
	}, []);

	return (
		<div className="flex flex-col items-center gap-8">
			<h1 className="text-2xl font-bold text-primary">Verifique seu e-mail</h1>
			<section className="text-center">
				<p>
					Enviamos um link temporário de acesso para o seu e-mail{" "}
					<span className="font-bold">{email}</span>.
				</p>
				<p>Por favor, verifique sua caixa de entrada e a pasta de spam.</p>
			</section>
			<section className="space-y-4">
				<Link href="/auth/sign-in" className="hover:underline">
					Voltar ao login
				</Link>
			</section>
		</div>
	);
}
