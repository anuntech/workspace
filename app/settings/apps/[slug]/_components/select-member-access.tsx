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
import api from "@/libs/api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getS3Image } from "@/libs/s3-client";

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

  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  const membersQuery = useQuery({
    queryKey: ["workspace/members"],
    queryFn: () => api.get(`/api/workspace/members/${workspace}`),
  });

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
      : membersQuery.data?.data
          .filter((member: any) => selectedMembers.includes(member.id))
          .map((member: any) => member.name)
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
        {membersQuery.data?.data.map((member: any) => (
          <DropdownMenuCheckboxItem
            key={member.id}
            checked={selectedMembers.includes(member.id)}
            onCheckedChange={(checked) =>
              handleCheckedChange(member.id, checked)
            }
            onSelect={(event) => event.preventDefault()}
            className="space-x-2"
          >
            {member?.icon?.value ? (
              <div>
                {member?.icon.type === "emoji" ? (
                  <span className="text-[2rem] w-full h-full flex size-10">
                    {member?.icon.value}
                  </span>
                ) : (
                  <Avatar className="size-10">
                    <AvatarImage
                      src={getS3Image(member?.icon.value) || "/shad.png"}
                      alt="@shadcn"
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ) : (
              <Avatar className="size-5">
                <AvatarImage src={member?.image || "/shad.png"} alt="@shadcn" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            )}
            <span>{member.name}</span>
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
