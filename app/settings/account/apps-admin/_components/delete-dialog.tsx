"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import api from "@/libs/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";

export function DeleteDialog({
  applicationId,
  open,
  setOpen,
}: {
  applicationId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const deleteApplicationMutation = useMutation({
    mutationFn: async (data: any) =>
      api.delete(`/api/applications/manage/${data.id}`),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["allApplications"],
        type: "all",
      });
      setOpen(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deleteApplicationMutation.mutate({
                id: applicationId,
              })
            }
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
