"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api";
import { ApplicationItem } from "./_components/application-tem";

export default function AppsAdminPage() {
  const searchParams = useSearchParams();
  const allAppsQuery = useQuery({
    queryKey: ["allApplications"],
    queryFn: async () => await api.get(`/api/applications`),
  });

  const workspace = searchParams.get("workspace");

  return (
    <div className="flex flex-col items-center p-10">
      <div className="w-full max-w-3xl space-y-5">
        <h1 className="text-2xl">Aplicações</h1>
        <div className="flex justify-between items-center">
          <Input
            type="text"
            placeholder="Procurar aplicativos..."
            className="w-2/3"
          />
          <Button className="ml-4">
            <Link href={`/settings/account/admin?workspace=${workspace}`}>
              Criar aplicativo
            </Link>
          </Button>
        </div>

        <div className="space-y-5">
          {allAppsQuery.data?.data.map((application: any, index: number) => (
            <ApplicationItem application={application} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
