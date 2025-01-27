"use client";

import Link from "next/link";
import Image from "next/image";
import { InviteWorkspaceForm } from "./_components/invite-workspace-form";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function InviteWorkspacePage() {
	const searchParams = useSearchParams();
	const invite = searchParams.get("token");

	const getInviteDataQuery = useQuery({
		queryKey: ["workspace/get-invite-data"],
		queryFn: async () => {
			const res = await fetch(`/api/workspace/get-invite-data/${invite}`);
			return {
				data: await res.json(),
				status: res.status,
			};
		},
	});

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
				<div className="flex w-full max-w-sm flex-col items-center">
					<h1 className="mb-8 text-center text-2xl font-bold text-primary">
						Convite para participar do workspace{" "}
						{getInviteDataQuery.data?.data.name}
					</h1>
					<section className="w-full space-y-4">
						<InviteWorkspaceForm />
					</section>
				</div>
			</main>
		</div>
	);
}
