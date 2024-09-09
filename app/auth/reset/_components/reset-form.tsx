import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/forms/password-input'

export function ResetForm() {
  return (
    <form className="w-full space-y-4">
      <PasswordInput placeholder="Senha" name="password" autoFocus />
      <PasswordInput placeholder="Confirme sua senha" name="confirmPassword" />
      <Button type="submit" className="w-full py-6">
        Continuar
      </Button>
    </form>
  )
}
