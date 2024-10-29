"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/libs/api";
import config from "@/config";
import { useSearchParams } from "next/navigation";

export function Plan() {
  const [isPlanAnnual, setIsPlanAnnual] = useState(true);
  const searchParams = useSearchParams();

  const handlePayment = async () => {
    try {
      const { data } = await api.post("/api/stripe/create-checkout", {
        priceId: config.stripe.plans[0].priceId,
        successUrl: window.location.href,
        cancelUrl: window.location.href,
        mode: "subscription",
        workspaceId: searchParams.get("workspace"),
      });

      window.location.href = data.url;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-3 px-3 pb-5 pt-3">
      <div className="flex justify-between">
        <h2 className="text-lg">Enterprise</h2>
        <div className="flex justify-between rounded-full bg-zinc-300 p-1">
          <button
            type="button"
            className={`rounded-full px-2 text-xs ${
              !isPlanAnnual ? "bg-white" : "text-muted-foreground"
            }`}
            onClick={() => setIsPlanAnnual(false)}
          >
            Mensal
          </button>
          <button
            type="button"
            className={`rounded-full px-2 text-xs ${
              isPlanAnnual ? "bg-white" : "text-muted-foreground"
            }`}
            onClick={() => setIsPlanAnnual(true)}
          >
            Anual
          </button>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl">R$ {isPlanAnnual ? "5.009,76" : "497"}</span>
        <span className="text-xs text-muted-foreground">
          por {isPlanAnnual ? "ano" : "mês"}
        </span>
      </div>
      <div className="flex justify-center">
        <Button className="w-full" onClick={handlePayment}>
          Atualizar
        </Button>
      </div>
    </div>
  );
}
