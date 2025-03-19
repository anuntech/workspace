import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex h-screen flex-col">
			{/* <header className="flex justify-end px-8 py-5">
        <Link href="/help" className="hover:underline">
          Ajuda
        </Link>
      </header> */}
			<main className="flex flex-1 flex-col items-center justify-center gap-8">
				<Image
					src="/anuntech.png"
					width={100}
					height={100}
					alt="Anuntech Logo"
					className="mb-[-25px]"
				/>
				{children}
			</main>
		</div>
	);
}
