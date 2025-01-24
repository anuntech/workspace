import React, { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { UserSearchInput } from "@/components/user-search-input";
import { IUser } from "@/models/User";
import { Button } from "@/components/ui/button";

export function LinkShareManager({
	linkId,
	isOpen,
	setIsOpen,
}: {
	linkId: string;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) {
	const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
	const workspaceId = "yourWorkspaceId"; // Replace with actual workspace ID logic

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
				<div className="flex gap-2 items-center">
					<UserSearchInput
						selectedUsers={selectedUsers}
						setSelectedUsers={setSelectedUsers}
						workspaceId={workspaceId}
						// Optionally, add excludedUsers if needed
						// excludedUsers={excludedUsers}
					/>
					<Button
						onClick={() => handleShare()}
						disabled={selectedUsers.length < 1}
					>
						Adicionar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
