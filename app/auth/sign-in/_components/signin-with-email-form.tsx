import Link from 'next/link'
import { useFormState } from 'react-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/forms/password-input'
import { login } from '@/actions/login'

export function SignInWithEmailForm() {
  const [state, action] = useFormState(login, {
    ok: false,
    error: '',
    data: null,
  })

  return (
    <form action={action} className="w-full transform space-y-4">
      <Input
        type="email"
        name="email"
        placeholder="E-mail"
        className="py-6"
        autoFocus
      />
      <div className="space-y-1.5">
        <PasswordInput placeholder="Senha" name="password" />
        <Link
          href="/auth/forgot"
          className="block text-end text-xs text-primary hover:underline"
        >
          Esqueceu a senha?
        </Link>
      </div>
      <Button type="submit" className="w-full py-6">
        Continuar com e-mail
      </Button>
    </form>
  )
}
