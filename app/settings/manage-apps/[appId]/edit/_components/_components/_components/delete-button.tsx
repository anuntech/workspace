import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "@/hooks/use-toast";
import api from "@/libs/api";
import { Button } from "@/components/ui/button";

interface Props {
	id: string;
	fieldId?: string;
	type: "principal-link" | "sub-link-edit" | "sub-link-create";
	setMainDialogState: Dispatch<SetStateAction<boolean>>
}

export const DeleteButton = ({ id, fieldId, type, setMainDialogState }: Props) => {
	const [isOpen, setIsOpen] = useState(false)

	const queryClient = useQueryClient();

	const deleteApplicationMutation = useMutation({
		mutationFn: async () => {
			const formData = new FormData();

			formData.append("id", id)

			if (type !== "principal-link" && fieldId) {
				formData.append("fieldId", fieldId)
			}

			api.delete("/api/applications/edit/menu-main", { data: formData })
		},
		onSuccess: () => {
			queryClient.refetchQueries({
				queryKey: ["applications"],
				type: "all",
			});
			toast({
				description: "Aplicativo deletado com sucesso.",
				duration: 5000,
			});
			setIsOpen(false)
			setMainDialogState(false)
		},
		onError: () => {
			toast({
				description: "Algo deu errado ao deletar o aplicativo.",
				duration: 5000,
				variant: "destructive",
			});
		},
	});

	const handleDeleteSublink = () => {
		deleteApplicationMutation.mutate()
	}

	return (
		<Dialog open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
			}}>
			<DialogTrigger asChild>
				<Button onClick={() => setIsOpen(true)} type="button" className="max-w-24 w-full" variant="destructive">Deletar
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Você tem certeza?</DialogTitle>
					<DialogDescription>
						Esta ação não pode ser desfeita. Isso excluirá permanentemente este sublink.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button type="button" className="max-w-24 w-full" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
					<Button type="button" className="max-w-24 w-full" variant="destructive" onClick={handleDeleteSublink}>Confirmar</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
