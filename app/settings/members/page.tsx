"use client";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Invites } from "./_components/invites";
import { Members } from "./_components/members";

export default function MembersPage() {
  return (
    <main className="flex flex-col items-center p-10">
      <div className="w-full max-w-3xl space-y-5">
        <h1 className="text-2xl">Membros</h1>
        <Separator />
        <Tabs defaultValue="members" className="space-y-10">
          <TabsList>
            <TabsTrigger value="members">Membros</TabsTrigger>
            <TabsTrigger value="invites">Convites</TabsTrigger>
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
