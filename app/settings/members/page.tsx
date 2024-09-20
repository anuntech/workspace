"use client";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Invites } from "./_components/invites";
import { Members } from "./_components/members";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function MembersPage() {
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  // const membersQuery = useQuery({
  //   queryKey: ["workspace/members"],
  //   queryFn: () =>
  //     fetch(`/api/workspace/members/${workspace}`).then((res) => res.json()),
  // });

  const ownerQuery = useQuery({
    queryKey: ["workspace/owner"],
    queryFn: () =>
      fetch(`/api/workspace/owner/${workspace}`).then((res) => res.json()),
  });

  console.log(userQuery.data, ownerQuery.data, "\n\n\n\n\n\n\n\n\n");

  return (
    <main className="flex flex-col items-center p-10">
      <div className="w-full max-w-3xl space-y-5">
        <h1 className="text-2xl">Membros</h1>
        <Separator />
        <Tabs defaultValue="members" className="space-y-10">
          <TabsList>
            <TabsTrigger value="members">Membros</TabsTrigger>
            <TabsTrigger
              disabled={userQuery?.data?._id != ownerQuery?.data?.id}
              value="invites"
            >
              Convites
            </TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <Members />
          </TabsContent>
          <TabsContent value="invites">
            <Invites />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
