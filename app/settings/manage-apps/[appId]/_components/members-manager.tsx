"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import api from "@/libs/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getS3Image } from "@/libs/s3-client";
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
import { Trash2 } from "lucide-react";

type User = {
  _id: string;
  name: string;
  email: string;
  image: string;
  icon?: {
    value: string;
    type: "image" | "emoji";
  };
};

export function MembersManager({ params }: { params: { appId: string } }) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  const appMembersMutation = useMutation({
    mutationFn: (data: { workspaceId: string; memberId: string }) =>
      api.post(`/api/workspace/rules/members`, {
        workspaceId: data.workspaceId,
        memberId: data.memberId,
        appId: params.appId,
      }),
    onError: (error) => {
      console.error("Erro ao adicionar membro:", error);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["appMembers"],
        type: "active",
      });
      setSelectedUsers([]);
    },
  });

  const appMembersQuery = useQuery({
    queryKey: ["appMembers"],
    queryFn: async () => {
      const res = await api.get(`/api/workspace/rules/members/${workspace}`);
      return res;
    },
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (data: { userId: string }) =>
      api.delete(
        `/api/workspace/rules/members/${workspace}/${data.userId}/${params.appId}`
      ),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["appMembers"],
        type: "active",
      });
    },
  });

  const handleAddMembers = async () => {
    appMembersMutation.mutate({
      memberId: selectedUsers[0]._id,
      workspaceId: workspace,
    });
  };

  const handleDeleteMember = async (id: string) => {
    deleteMutation.mutate({
      userId: id,
    });
  };

  const members = appMembersQuery.data?.data?.find((ap: any) => ap.appId);
  return (
    <div className="space-y-5 h-96">
      <section>
        <h2 className="text-lg font-bold">
          Adicionar membros para um aplicativo
        </h2>
        <span className="text-sm text-zinc-500">
          Adicione os membros da sua equipe para terem acesso a esse app.
        </span>
      </section>
      <section>
        <div className="flex gap-2 items-center">
          <UserSearchInput
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            workspaceId={workspace}
            excludedUsers={members?.members}
          />
          <Button
            onClick={() => handleAddMembers()}
            className="h-full"
            disabled={
              selectedUsers.length < 1 ||
              deleteMutation.isPending ||
              appMembersQuery.isPending ||
              appMembersMutation.isPending
            }
          >
            Adicionar
          </Button>
        </div>
        <div className="mt-7">
          {members?.members.map((member: any) => (
            <div
              key={member._id}
              className="flex items-center justify-between space-x-4 hover:bg-gray-100 p-4 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                {member.icon && (
                  <div className="text-[1.3rem]">
                    {member.icon.type == "emoji" ? (
                      member.icon.value
                    ) : (
                      <img
                        className="rounded-full"
                        width={54}
                        height={54}
                        src={getS3Image(member.icon.value)}
                        alt=""
                      />
                    )}
                  </div>
                )}
                {!member.icon && (
                  <Avatar className="size-10">
                    <AvatarImage
                      src={member?.image || "/shad.png"}
                      alt="@shadcn"
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                )}
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
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function UserSearchInput({
  selectedUsers,
  setSelectedUsers,
  workspaceId,
  excludedUsers = [],
}: {
  selectedUsers: User[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  workspaceId: string;
  excludedUsers?: any[];
}) {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const membersQuery = useQuery({
    queryKey: ["workspace/members"],
    queryFn: () => api.get(`/api/workspace/members/${workspaceId}`),
  });

  const users = membersQuery.data?.data || [];

  const availableUsers = users
    .filter(
      (user: any) =>
        !selectedUsers.some((selected) => selected._id === user._id) &&
        !excludedUsers.some((excluded) => excluded.id === user._id) &&
        (user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()))
    )
    .filter((user: any) => user.role !== "admin");

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers((prev) => [...prev, user]);
      setQuery("");
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap gap-2 p-1 border rounded-md shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300 ease-in-out">
        {selectedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center px-2 bg-blue-100 text-blue-800 rounded-full shadow-sm"
          >
            <span className="text-sm">{user.name}</span>
            <button
              className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
              onClick={() => handleRemoveUser(user._id)}
            >
              ✕
            </button>
          </div>
        ))}
        <Input
          placeholder="Selecione um usuário"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
          className="flex-1 min-w-[100px] border-none focus:ring-0 focus:outline-none shadow-none focus-visible:outline-none  focus-visible:ring-0"
          disabled={membersQuery.isPending}
        />
      </div>

      {isDropdownOpen && (
        <div className="absolute max-h-56 overflow-auto mt-2 w-full border bg-white rounded-md shadow-lg z-10 transition-all duration-300 ease-in-out">
          {availableUsers.length > 0 ? (
            availableUsers.map((user: any) => (
              <div
                key={user._id}
                className={cn(
                  "flex items-center px-4 py-2 space-x-3 hover:bg-blue-100 cursor-pointer transition-colors"
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectUser(user)}
              >
                {user.icon && (
                  <div className="text-[1.3rem]">
                    {user.icon.type == "emoji" ? (
                      user.icon.value
                    ) : (
                      <img
                        className="rounded-full"
                        width={54}
                        height={54}
                        src={getS3Image(user.icon.value)}
                        alt=""
                      />
                    )}
                  </div>
                )}
                {!user.icon && (
                  <Avatar className="size-10">
                    <AvatarImage
                      src={user?.image || "/shad.png"}
                      alt="@shadcn"
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                )}

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              Nenhum usuário encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}
