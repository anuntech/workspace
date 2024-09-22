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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getWorkspaceIcon } from "@/libs/icons";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Trash2 } from "lucide-react";

export function RenderWorkspaces() {
  const workspaceQuery = useQuery({
    queryKey: ["workspace"],
    queryFn: () => fetch("/api/workspace").then((res) => res.json()),
  });

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  const isOwner = (workspace: any) => {
    return workspace.owner === userQuery.data?._id;
  };

  const getRole = (workspace: any) => {
    const role = workspace.members.find(
      (member: any) =>
        member.memberId.toString() === userQuery.data?._id.toString()
    )?.role;

    return role == "member" ? "Membro" : "Administrador";
  };

  return workspaceQuery.isPending ? (
    <div className="space-y-3">
      <Skeleton className="h-11 w-full justify-start gap-2 px-3 text-start" />
      <Skeleton className="h-11 w-full justify-start gap-2 px-3 text-start" />
      <Skeleton className="h-11 w-full justify-start gap-2 px-3 text-start" />
    </div>
  ) : (
    workspaceQuery.data?.map((workspace: any) => (
      <div
        className="flex items-center justify-between space-x-4"
        key={workspace.id}
      >
        <div className="flex items-center space-x-4">
          <Avatar>
            {getWorkspaceIcon(workspace.icon) ? (
              <div className="flex items-center justify-center w-full h-full">
                {getWorkspaceIcon(workspace.icon)}
              </div>
            ) : (
              <AvatarFallback>OM</AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{workspace.name}</p>
            <p className="text-sm text-muted-foreground">
              {isOwner(workspace) ? "Proprietário" : getRole(workspace)}
            </p>
          </div>
        </div>
        {isOwner(workspace) ? (
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="group hover:border-red-500 hover:bg-red-50"
                >
                  <Trash2 className="size-4 group-hover:text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá
                    permanentemente o membro de seu workspace.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction>Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="group hover:border-red-500 hover:bg-red-50"
                  >
                    <LogOut className="size-4 group-hover:text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Ao sair, você perderá o acesso a este workspace. Esta ação
                      não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction>Continuar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </div>
    ))
  );
}
