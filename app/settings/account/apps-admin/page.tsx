"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Pencil } from "lucide-react"; // ícone para o botão de opções
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api";
import { getS3Image } from "@/libs/s3-client";
import { ApplicationsDropdown } from "./_components/applications-dropdown";

export default function AppsAdminPage() {
  const events = [
    // ... (eventos de exemplo)
  ];

  const searchParams = useSearchParams();
  const allAppsQuery = useQuery({
    queryKey: ["allApplications"],
    queryFn: async () => await api.get(`/api/applications`),
  });

  if (allAppsQuery.isPending) {
    return <p>Loading</p>;
  }

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
            <div
              key={index}
              className="flex items-center space-x-4 p-4 border-b"
            >
              <div className="relative w-20 h-20">
                {application.avatarSrc ? (
                  <img
                    src={getS3Image(application.avatarSrc)}
                    alt={application.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="bg-zinc-300 w-full h-full rounded-[10px] flex items-center justify-center text-[1.5rem]">
                    ?
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 rounded-md transition-opacity duration-300">
                  <Button
                    variant="ghost"
                    className="p-2 text-white hover:text-black"
                  >
                    <Pencil className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col flex-grow">
                <h2 className="text-lg font-semibold">{application.name}</h2>
                <p className="text-sm text-gray-500">
                  {application.description}
                </p>
              </div>
              <ApplicationsDropdown application={application} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
