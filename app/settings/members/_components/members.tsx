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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function Members() {
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  const queryClient = useQueryClient();

  const ownerQuery = useQuery({
    queryKey: ["workspace/owner"],
    queryFn: () =>
      fetch(`/api/workspace/owner/${workspace}`).then((res) => res.json()),
  });

  const workspaceQuery = useQuery({
    queryKey: ["workspace/members"],
    queryFn: () =>
      fetch(`/api/workspace/members/${workspace}`).then((res) => res.json()),
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      workspaceId: string;
      memberId: string;
      role: string;
    }) =>
      fetch(`/api/workspace/member/${data.workspaceId}/${data.memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: data.role }),
      }),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["workspace/members"],
        type: "active",
      });
    },
  });

  const transferOwnerMutation = useMutation({
    mutationFn: (data: { workspaceId: string; userId: string }) =>
      fetch(`/api/workspace/transfer-owner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["workspace/members"],
        type: "active",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (data: { workspaceId: string; userId: string }) =>
      fetch(`/api/workspace/member/${data.workspaceId}/${data.userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["workspace/members"],
        type: "active",
      });
    },
  });

  const handleRoleChange = async (memberId: string, role: string) => {
    updateMutation.mutate({
      workspaceId: workspace,
      memberId: memberId,
      role: role,
    });
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleTransferOwner = async (memberId: string) => {
    transferOwnerMutation.mutate({
      workspaceId: workspace,
      userId: memberId,
    });
  };

  console.log(workspaceQuery.data);

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-lg font-bold">Membros do workspace</h2>
        <span className="text-sm text-zinc-500">
          Convide os membros da sua equipe para colaborar.
        </span>
      </section>
      {deleteMutation.isPending ||
      ownerQuery.isPending ||
      workspaceQuery.isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-11 w-full justify-start gap-2 px-3 text-start" />
          <Skeleton className="h-11 w-full justify-start gap-2 px-3 text-start" />
          <Skeleton className="h-11 w-full justify-start gap-2 px-3 text-start" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={ownerQuery.data?.image || "/shad.png"} />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  {ownerQuery.data?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ownerQuery.data?.email}
                </p>
              </div>
            </div>
          </div>
          {workspaceQuery?.data?.map((member: any) => (
            <div
              key={member._id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={member.image || "/shad.png"} />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {member.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  open={isOpen}
                  onOpenChange={(open) => setIsOpen(open)}
                  defaultValue={member.role}
                  onValueChange={(props) => handleRoleChange(member._id, props)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="member">Membro</SelectItem>
                      <Separator className="my-1 h-px bg-gray-200" />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            value="owner"
                            variant="ghost"
                            className="text-destructive w-full text-left p-2 hover:bg-gray-100 rounded-sm focus:bg-gray-100"
                          >
                            Transferir proprietário
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Você tem certeza?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso excluirá
                              permanentemente o membro de seu workspace.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleTransferOwner(member._id)}
                            >
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                      <AlertDialogAction
                        onClick={() =>
                          deleteMutation.mutate({
                            workspaceId: workspace,
                            userId: member._id,
                          })
                        }
                      >
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
