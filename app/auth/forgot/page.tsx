import Link from 'next/link'
import { ForgotForm } from './_components/forgot-form'

export default function ForgotPage() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center">
      <h1 className="mb-8 text-2xl font-bold text-primary">
        Recupere sua senha
      </h1>
      <div className="w-full space-y-4">
        <ForgotForm />
      </div>
      <section className="py-4">
        <p className="text-sm text-zinc-500">
          Lembrou a senha?{' '}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </section>
    </div>
  )
}
