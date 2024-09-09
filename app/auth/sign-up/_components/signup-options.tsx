'use client'

import Link from 'next/link'
import { useState } from 'react'
import { GoogleButton } from '../../_components/google-button'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SignUpWithEmailForm } from './signup-with-email-form'

export function SignUpOptions() {
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false)

  function handleContinueWithEmail() {
    setIsEmailFormVisible(!isEmailFormVisible)
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center">
      <h1 className="mb-8 text-2xl font-bold text-primary">
        {isEmailFormVisible
          ? 'Qual é o seu e-mail?'
          : 'Cadastrar-se na Anuntech'}
      </h1>
      {!isEmailFormVisible ? (
        <>
          <div className="w-full space-y-4">
            <GoogleButton />
            <Button
              type="button"
              variant="outline"
              className="w-full py-6"
              onClick={handleContinueWithEmail}
            >
              Continuar com e-mail
            </Button>
          </div>
          <section className="space-y-4 py-4">
            <p className="text-center text-sm text-zinc-500">
              Ao se registrar, você concorda com os{' '}
              <Link href="/terms" className="text-primary hover:underline">
                termos de uso
              </Link>{' '}
              da plataforma e{' '}
              <Link href="/dpa" className="text-primary hover:underline">
                políticas de privacidade
              </Link>{' '}
              da Anuntech.
            </p>
            <Separator className="mx-auto w-1/4" />
            <p className="text-center text-sm text-zinc-500">
              Já possui conta?{' '}
              <Link
                href="/auth/sign-in"
                className="text-primary hover:underline"
              >
                Entrar
              </Link>
            </p>
          </section>
        </>
      ) : (
        <>
          <SignUpWithEmailForm />
          <Button
            variant="link"
            className="mt-4"
            onClick={handleContinueWithEmail}
          >
            Voltar ao cadastro
          </Button>
        </>
      )}
    </div>
  )
}
