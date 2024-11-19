"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // Função para combinar classes no Tailwind
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  customerId?: string;
  priceId?: string;
  hasAccess?: boolean;
  icon?: {
    type: "image" | "emoji";
    value: string;
  };
};

export function MembersManager() {
  const searchParams = useSearchParams();
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
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <Input
        placeholder="Selecione um usuário"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)} // Abre o menu ao focar no input
        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Fecha o menu após sair do foco (delay para clique)
        className="w-full"
      />

      {isDropdownOpen && filteredUsers.length > 0 && (
        <div className="absolute mt-2 w-full border bg-white rounded-md shadow-md">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={cn(
                "flex items-center px-4 py-2 space-x-3 hover:bg-gray-100 cursor-pointer"
              )}
              onMouseDown={(e) => e.preventDefault()} // Previne blur ao clicar no item
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

      {isDropdownOpen && filteredUsers.length === 0 && (
        <div className="absolute mt-2 w-full border bg-white rounded-md shadow-md z-10 px-4 py-2 text-sm text-gray-500">
          Nenhum usuário encontrado
        </div>
      )}
    </div>
  );
}
