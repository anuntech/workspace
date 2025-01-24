import { getCsrfToken } from "next-auth/react";
import { SignInOptions } from "./_components/signin-options";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
	const session = await getServerSession(authOptions);

	if (session) {
		return redirect("/");
	}

	const csrfToken = await getCsrfToken();

	return <SignInOptions csrfToken={csrfToken} />;
}
