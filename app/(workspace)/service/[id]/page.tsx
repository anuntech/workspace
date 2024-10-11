"use client";

import { api } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";
import { Loader, LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  if (!params.id) {
    router.push("/");
    return;
  }

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      return await api.get(`/api/applications/${workspace}`);
    },
  });

  if (applicationsQuery.isPending) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <LoaderCircle className="m-auto animate-spin" />
      </div>
    );
  }

  const app = applicationsQuery.data.data.find(
    (app: any) => app._id === params.id
  );
  return (
    <>
      {isIframeLoading && (
        <div className="h-[100vh] flex justify-center items-center">
          <LoaderCircle className="m-auto animate-spin" />
        </div>
      )}
      <iframe
        src={app.applicationUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="Roteiro Digital"
        onLoad={() => setIsIframeLoading(false)}
      />
    </>
  );
}
