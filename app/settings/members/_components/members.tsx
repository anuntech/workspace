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
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function Members() {
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

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

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-lg font-bold">Membros do workspace</h2>
        <span className="text-sm text-zinc-500">
          Convide os membros da sua equipe para colaborar.
        </span>
      </section>
      {ownerQuery.isPending || workspaceQuery.isPending ? (
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
                <Select defaultValue={member.role}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="member">Membro</SelectItem>
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
                      <AlertDialogAction>Continuar</AlertDialogAction>
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
