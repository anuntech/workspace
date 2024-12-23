import { Check } from 'lucide-react'

interface PlanItemProps {
  title?: string
  onlyIcon?: boolean
}

export function PlanItem({ title, onlyIcon = false }: PlanItemProps) {
  return (
    <div className="flex h-10 items-center gap-2 border-b">
      {onlyIcon ? (
        <Check className="size-4 text-primary" />
      ) : !onlyIcon && title ? (
        <>
          <Check className="size-4 text-primary" />
          <span className="text-sm">{title}</span>
        </>
      ) : null}
    </div>
  )
}
