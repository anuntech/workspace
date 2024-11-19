"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export function MembersManager() {
  return (
    <div className="space-y-5 h-96">
      <section>
        <h2 className="text-lg font-bold">Convidar para o workspace</h2>
        <span className="text-sm text-zinc-500">
          Convide os membros da sua equipe para colaborar.
        </span>
      </section>
      <section className="flex gap-2">
        <UserSearchInput />
        <Button>Adicionar</Button>
      </section>
    </div>
  );
}

const users: User[] = [
  {
    id: "1",
    name: "Renata Macedo",
    email: "renata.macedo@watecservice.com",
    image: "",
  },
  {
    id: "2",
    name: "Renata Lima",
    email: "renata.lima@grupovalitek.com.br",
    image: "",
  },
  {
    id: "3",
    name: "Luciane Molinari",
    email: "luciane.molinari@grupovalitek.com.br",
    image: "",
  },
  {
    id: "4",
    name: "Alexandre Domene",
    email: "alexandre@grupovalitek.com.br",
    image: "",
  },
  {
    id: "5",
    name: "Luana Campos",
    email: "luana.campos@watecservice.com",
    image: "",
  },
];

export function UserSearchInput() {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // Filtrar usuários disponíveis (não selecionados e que correspondem à busca)
  const availableUsers = users.filter(
    (user) =>
      !selectedUsers.some((selected) => selected.id === user.id) &&
      (user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers((prev) => [...prev, user]);
      setQuery("");
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md">
        {selectedUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center px-2 py-1 bg-gray-100 rounded-full"
          >
            <span className="text-sm text-gray-800">{user.name}</span>
            <button
              className="ml-2 text-gray-500 hover:text-gray-700"
              onClick={() => handleRemoveUser(user.id)}
            >
              ✕
            </button>
          </div>
        ))}
        <Input
          placeholder="Selecione um usuário"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)} // Abre o menu ao focar no input
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Fecha o menu após sair do foco (delay para clique)
          className="flex-1 min-w-[100px]"
        />
      </div>

      {/* Dropdown */}
      {isDropdownOpen && availableUsers.length > 0 && (
        <div className="absolute mt-2 w-full border bg-white rounded-md shadow-md z-10">
          {availableUsers.map((user) => (
            <div
              key={user.id}
              className={cn(
                "flex items-center px-4 py-2 space-x-3 hover:bg-gray-100 cursor-pointer"
              )}
              onMouseDown={(e) => e.preventDefault()} // Previne blur ao clicar no item
              onClick={() => handleSelectUser(user)}
            >
              <Avatar className="w-8 h-8">
                {user.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : (
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDropdownOpen && availableUsers.length === 0 && (
        <div className="absolute mt-2 w-full border bg-white rounded-md shadow-md z-10 px-4 py-2 text-sm text-gray-500">
          Nenhum usuário encontrado
        </div>
      )}
    </div>
  );
}
