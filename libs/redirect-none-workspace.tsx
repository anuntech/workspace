"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function RedirectNoneWorkspace({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = useQuery<any[]>({
    queryKey: ["workspace"],
    queryFn: () => fetch("/api/workspace").then((res) => res.json()),
  });

  const router = useRouter();

  const count = data?.length;

  if (count === 0) {
    router.push("/create-workspace");
  }

  return children;
}
