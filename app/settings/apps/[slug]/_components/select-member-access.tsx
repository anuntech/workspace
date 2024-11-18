"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserPlus } from "lucide-react";

type Member = {
  id: number;
  name: string;
};

export function SelectMemberAccess() {
  const members: Member[] = [
    { id: 1, name: "João" },
    { id: 2, name: "Maria" },
    { id: 3, name: "Pedro" },
    { id: 4, name: "Pedro" },
    { id: 5, name: "Pedro" },
    { id: 6, name: "Pedro" },
    { id: 7, name: "Pedro" },
  ];

  const [selectedMembers, setSelectedMembers] = React.useState<number[]>([]);

  const handleCheckedChange = (memberId: number, checked: boolean) => {
    setSelectedMembers((prevSelected) => {
      if (checked) {
        return [...prevSelected, memberId];
      } else {
        return prevSelected.filter((id) => id !== memberId);
      }
    });
  };

  const selectedMemberNames =
    selectedMembers.length === 0
      ? "Todos"
      : members
          .filter((member) => selectedMembers.includes(member.id))
          .map((member) => member.name)
          .join(", ");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <UserPlus />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Usuários permitidos</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {members.map((member) => (
          <DropdownMenuCheckboxItem
            key={member.id}
            checked={selectedMembers.includes(member.id)}
            onCheckedChange={(checked) =>
              handleCheckedChange(member.id, checked)
            }
            onSelect={(event) => event.preventDefault()}
          >
            {member.name}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-4 py-2 text-sm text-gray-500">
          {selectedMemberNames}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
