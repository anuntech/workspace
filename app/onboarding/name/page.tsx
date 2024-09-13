import { SetNameForm } from "./_components/set-name-form";

export default function NamePage() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center">
      <h1 className="mb-8 text-2xl font-bold text-primary">Defina seu nome</h1>
      <section className="w-full space-y-4">
        <SetNameForm />
      </section>
    </div>
  );
}
