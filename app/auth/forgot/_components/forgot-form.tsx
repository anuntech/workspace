import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ForgotForm() {
  return (
    <form className="w-full space-y-4">
      <Input
        type="email"
        name="email"
        placeholder="E-mail"
        className="py-6"
        autoFocus
      />
      <Button type="submit" className="w-full py-6">
        Continuar
      </Button>
    </form>
  )
}
