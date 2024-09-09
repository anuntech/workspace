'use client'

import { useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Plan() {
  const [isPlanAnnual, setIsPlanAnnual] = useState(true)

  return (
    <div className="space-y-3 px-3 pb-5 pt-3">
      <div className="flex justify-between">
        <h2 className="text-lg">Enterprise</h2>
        <div className="flex justify-between rounded-full bg-zinc-300 p-1">
          <button
            type="button"
            className={`rounded-full px-2 text-xs ${!isPlanAnnual ? 'bg-white' : 'text-muted-foreground'}`}
            onClick={() => setIsPlanAnnual(false)}
          >
            Mensal
          </button>
          <button
            type="button"
            className={`rounded-full px-2 text-xs ${isPlanAnnual ? 'bg-white' : 'text-muted-foreground'}`}
            onClick={() => setIsPlanAnnual(true)}
          >
            Anual
          </button>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl">R$ {isPlanAnnual ? '5.009,76' : '497'}</span>
        <span className="text-xs text-muted-foreground">
          por {isPlanAnnual ? 'ano' : 'mês'}
        </span>
      </div>
      <div className="flex justify-center">
        <a
          href={
            isPlanAnnual
              ? 'https://buy.stripe.com/test_dR615w0DP1c9cgM3ce'
              : 'https://buy.stripe.com/test_aEU4hI3Q1085bcIaEF'
          }
          target="_blank"
          className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
        >
          Atualizar
        </a>
      </div>
    </div>
  )
}
