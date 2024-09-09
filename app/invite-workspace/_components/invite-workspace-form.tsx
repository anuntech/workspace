import { Button } from '@/components/ui/button'

export function InviteWorkspaceForm() {
  return (
    <>
      <Button type="button" className="w-full py-6">
        Aceitar
      </Button>
      <Button type="button" variant="ghost" className="w-full py-6">
        Recusar
      </Button>
    </>
  )
}
