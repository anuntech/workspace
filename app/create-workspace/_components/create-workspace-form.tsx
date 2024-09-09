import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function CreateWorkspaceForm() {
  return (
    <form className="w-full space-y-4">
      <Input
        type="text"
        name="name"
        placeholder="Nome do seu workspace..."
        className="py-6"
        autoFocus
      />
      <Button type="submit" className="w-full py-6">
        Continuar
      </Button>
    </form>
  )
}
