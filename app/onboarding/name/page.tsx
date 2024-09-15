"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SetNameForm } from "./_components/set-name-form";

const queryClient = new QueryClient();

export default function NamePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex w-full max-w-sm flex-col items-center">
        <h1 className="mb-8 text-2xl font-bold text-primary">
          Defina seu nome
        </h1>
        <section className="w-full space-y-4">
          <SetNameForm />
        </section>
      </div>
    </QueryClientProvider>
  );
}
