'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SignUpWithEmailForm() {
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
        Continuar com e-mail
      </Button>
    </form>
  )
}
