"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export default function ServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  if (!params.id) {
    router.push("/");
    return;
  }

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res = await fetch(`/api/applications/${workspace}`);
      return res.json();
    },
  });

  if (applicationsQuery.isLoading) {
    return <div>Carregando...</div>;
  }

  const app = applicationsQuery.data.find((app: any) => app._id === params.id);
  return (
    <iframe
      src={app.applicationUrl}
      width="100%"
      height="100%"
      style={{ border: "none" }}
      title="Roteiro Digital"
    />
  );
}
