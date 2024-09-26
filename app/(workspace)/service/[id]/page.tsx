"use client";

import { useRouter } from "next/navigation";

export default function ServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();

  if (!params.id) {
    router.push("/");
    return;
  }

  return <div>This page will contain the service</div>;
}
