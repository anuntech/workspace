import { SetPasswordForm } from './_components/set-password-form'

export default function PasswordPage() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center">
      <h1 className="mb-8 text-2xl font-bold text-primary">Defina sua senha</h1>
      <section className="w-full space-y-4">
        <SetPasswordForm />
      </section>
    </div>
  )
}
