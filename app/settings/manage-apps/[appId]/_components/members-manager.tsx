"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import api from "@/libs/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getS3Image } from "@/libs/s3-client";

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

export function MembersManager({ params }: { params: { appId: string} }) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  const appMembersMutation = useMutation({
    mutationFn: (data: { workspaceId: string; memberId: string }) =>
      api.post(`/api/workspace/rules`, {
        workspaceId: data.workspaceId,
        memberId: data.memberId,
        appId: params.appId,
      }),
    onError: (error) => {
      console.error("Erro ao adicionar membro:", error);
    },
    onSuccess: () => {
      console.log("Membro adicionado com sucesso!");
    },
  });

  const handleAddMembers = async () => {
    const members = selectedUsers.map((user) => ({
      memberId: user._id,
    }));

    console.log("aaaa");
    console.log(selectedUsers[0]._id, workspace);
    
    appMembersMutation.mutate({
      memberId: selectedUsers[0]._id,
      workspaceId: workspace,
    })
  };


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
      <section className="">
        <div className="flex gap-2 items-center">
          <UserSearchInput
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            workspaceId={workspace}
          />
          <Button onClick={() => handleAddMembers()} className="h-full" disabled={selectedUsers.length < 1}>
            Adicionar
          </Button>
        </div>
      </section>
    </div>
  );
}

export function UserSearchInput({
  selectedUsers,
  setSelectedUsers,
  workspaceId,
}: {
  selectedUsers: User[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  workspaceId: string;
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
    <div className="relative w-full max-w-md">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300 ease-in-out">
        {selectedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full shadow-sm"
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
                {user.data?.icon?.value ? (
                  <div>
                    {user.data?.icon.type === "emoji" ? (
                      <span className="text-[2rem] w-full h-full flex size-10">
                        {user.data?.icon.value}
                      </span>
                    ) : (
                      <Avatar className="size-10">
                        <AvatarImage
                          src={getS3Image(user.data?.icon.value) || "/shad.png"}
                          alt="@shadcn"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ) : (
                  <Avatar className="size-10">
                    <AvatarImage
                      src={user.data?.image || "/shad.png"}
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
