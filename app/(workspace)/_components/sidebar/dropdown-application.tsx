"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/libs/api";
import { useRouter, useSearchParams } from "next/navigation";

import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, MoreHorizontal, PackageX, Share2, Trash } from "lucide-react";
import { useSession } from "next-auth/react";

export function DropdownApplication({
  isHover,
  applicationId,
  className,
}: {
  isHover?: boolean;
  applicationId: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const urlParams = useSearchParams();
  const workspace = urlParams.get("workspace");
  const queryClient = useQueryClient();
  const session = useSession();

  const applicationsQuery = useQuery({
    queryKey: ["applications/favorite"],
    queryFn: async () =>
      api.get(`/api/applications/favorite?workspaceId=${workspace}`),
  });

  const isThisAnFavoriteApp = applicationsQuery.data?.data.favorites.some(
    (a: any) =>
      a.userId == session.data?.user?.id && a.applicationId.id == applicationId
  );

  const changeFavoriteMutation = useMutation({
    mutationFn: async () =>
      api.post(`/api/applications/favorite`, {
        applicationId,
        workspaceId: workspace,
      }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["applications/favorite"],
        type: "all",
      });
    },
  });

  const router = useRouter();

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) setIsOpen(true);
        setTimeout(() => {
          setIsOpen(open);
        }, 100);
      }}
    >
      <DropdownMenuTrigger asChild className={className}>
        <button className={!isHover && !isOpen && "hidden"}>
          <MoreHorizontal className="size-4 " />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => changeFavoriteMutation.mutate()}>
            <Heart />
            {isThisAnFavoriteApp ? "Remover dos" : "Adicionar aos"} favoritos
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/settings/manage-apps/${applicationId}?workspace=${workspace}`
              )
            }
          >
            <Share2 />
            Compartilhar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => console.log("uninstall")}>
            <PackageX />
            Desinstalar
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
