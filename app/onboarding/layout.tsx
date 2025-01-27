import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import config from "@/config";
import { redirect } from "next/navigation";
import { authOptions } from "@/libs/next-auth";

export default async function OnboardingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect(config.auth.loginUrl);
	}

	return (
		<div className="flex h-screen flex-col">
			<header className="flex justify-end px-8 py-5">
				<Link href="/help" className="hover:underline">
					Ajuda
				</Link>
			</header>
			<main className="flex flex-1 flex-col items-center justify-center gap-8">
				<img
					src="/anuntech-icon-black.png"
					width={100}
					height={100}
					alt="Anuntech Logo"
					className="mb-[-20px]"
				/>
				{children}
			</main>
		</div>
	);
}
