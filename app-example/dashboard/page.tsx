import ButtonAccount from "@/components/ButtonAccount";
import ButtonCheckout from "@/components/ButtonCheckout";
import config from "@/config";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <ButtonAccount />
      </section>
    </main>
  );
}
