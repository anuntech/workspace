import { ResetForm } from './_components/reset-form'

export default function ResetPage() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center">
      <h1 className="mb-8 text-2xl font-bold text-primary">
        Redefina sua senha
      </h1>
      <section className="w-full space-y-4">
        <ResetForm />
      </section>
    </div>
  )
}
