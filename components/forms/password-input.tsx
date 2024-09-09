'use client'

import { InputHTMLAttributes, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
}

export function PasswordInput(props: PasswordInputProps) {
  const [isTypePassword, setIsTypePassword] = useState(true)

  function toggleTypePassword() {
    setIsTypePassword(!isTypePassword)
  }

  return (
    <div className="relative flex items-center">
      <Input
        type={isTypePassword ? 'password' : 'text'}
        className="py-6"
        {...props}
      />
      <button
        type="button"
        className="absolute right-3"
        title={`${isTypePassword ? 'Visualizar' : 'Ocultar'} senha`}
        onClick={toggleTypePassword}
      >
        {isTypePassword ? (
          <Eye className="size-5 text-zinc-500" />
        ) : (
          <EyeOff className="size-5 text-zinc-500" />
        )}
      </button>
    </div>
  )
}
