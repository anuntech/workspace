import Link from 'next/link'
import { redirect } from 'next/navigation'

interface StatusPageProps {
  params: {
    page: 'sign-up' | 'forgot'
  }
  searchParams: {
    email: string
  }
}

export default function StatusPage({ params, searchParams }: StatusPageProps) {
  const { page } = params
  const { email } = searchParams

  if (!email) {
    redirect(`/auth/${page}`)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-2xl font-bold text-primary">Verifique seu e-mail</h1>
      <section className="text-center">
        <p>Enviamos um link de login temporário.</p>
        <p>
          Por favor, verifique sua caixa de entrada em{' '}
          <span className="font-bold">{email}</span>.
        </p>
      </section>
      <section className="space-y-4">
        <Link
          href={page === 'sign-up' ? '/auth/sign-up' : '/auth/forgot'}
          className="hover:underline"
        >
          {page === 'sign-up'
            ? 'Voltar ao cadastro'
            : 'Voltar à recuperação de senha'}
        </Link>
      </section>
    </div>
  )
}
