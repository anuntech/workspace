import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getS3Image } from "@/libs/s3-client";
import { useQuery } from "@tanstack/react-query";
import { CircleHelp, CircleUser, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function UserNav() {
  const { isPending, data } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  return isPending ? (
    <Skeleton className="h-11 w-full justify-start gap-2 px-3 text-start" />
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-11 w-full justify-start gap-2 px-3 text-start"
        >
          {data?.icon && (
            <div className="text-[1.3rem]">
              {data.icon.type == "emoji" ? (
                data.icon.value
              ) : (
                <Image
                  className="rounded-full"
                  width={54}
                  height={54}
                  src={getS3Image(data.icon.value)}
                  alt=""
                />
              )}
            </div>
          )}
          {!data?.icon && (
            <Avatar className="size-10">
              <AvatarImage src={data?.image || "/shad.png"} alt="@shadcn" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          )}
          <span className="flex flex-col w-full overflow-hidden">
            <span className="text-ellipsis overflow-hidden whitespace-nowrap">
              {data?.name}
            </span>
            <span className="text-xs text-zinc-500 text-ellipsis overflow-hidden whitespace-nowrap">
              {data?.email}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="center" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-ellipsis overflow-hidden whitespace-nowrap">
              {data?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap">
              {data?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              href={`/settings/account`}
              className="flex w-full items-center gap-2"
            >
              <CircleUser className="size-4" />
              Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <CircleHelp className="size-4" />
            Suporte
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2" onClick={() => signOut()}>
          <LogOut className="size-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
