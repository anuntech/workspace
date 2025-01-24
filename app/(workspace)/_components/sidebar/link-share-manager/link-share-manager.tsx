import React, { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Share2 } from "lucide-react";

export function LinkShareManager({
	linkId,
	isOpen,
	setIsOpen,
}: {
	linkId: string;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) {
	const handleShare = () => {
		// Implement your share logic here
		console.log("Sharing link:", linkId);
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				setTimeout(() => (document.body.style.pointerEvents = ""), 500);
			}}
		>
			<DialogTrigger asChild></DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Adicionar membros para um link?</DialogTitle>
					<DialogDescription>
						Adicione os membros da sua equipe para que eles possam acessar a
						esse link
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
