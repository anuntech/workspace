"use client";

import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "./delete-dialog";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ApplicationsDropdown({ application }: { application: any }) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const workspace = useSearchParams().get("workspace");
	const [dropdownOpen, setDropdownOpen] = useState(false);

	return (
		<>
			<DropdownMenu
				open={dropdownOpen || deleteDialogOpen}
				onOpenChange={(open) => setDropdownOpen(open)}
			>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost">
						<MoreHorizontal className="w-5 h-5" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuGroup>
						<Link
							href={`/settings/account/admin-edit?edit=${application.id}&&workspace=${workspace}`}
						>
							<DropdownMenuItem>
								<Pencil className="mr-2 h-4 w-4" />
								<span>Editar</span>
							</DropdownMenuItem>
						</Link>
						<DropdownMenuItem
							onClick={() => {
								setDeleteDialogOpen(true);
							}}
						>
							<Trash className="mr-2 h-4 w-4" />
							<span>Deletar</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
				</DropdownMenuContent>
			</DropdownMenu>

			{deleteDialogOpen && (
				<DeleteDialog
					applicationId={application.id}
					open={deleteDialogOpen}
					setOpen={setDeleteDialogOpen}
				/>
			)}
		</>
	);
}
