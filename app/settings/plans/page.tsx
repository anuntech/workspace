import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlanItem } from "./_components/plan-item";
import { Plan } from "./_components/plan";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PlansPage() {
  return (
    <>
      {" "}
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-col items-center p-10">
        <div className="w-full max-w-3xl space-y-5">
          <h1 className="text-2xl">Planos</h1>
          <Separator />
          <section className="grid grid-cols-3 py-5">
            <div className="space-y-5">
              <div className="space-y-3 pr-3 pt-3">
                <h2 className="text-lg">Gratuito</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl">R$ 0</span>
                  <span className="text-xs text-muted-foreground">por mês</span>
                </div>
                <div className="flex justify-center">
                  <Button className="w-full" variant="outline" disabled>
                    Plano atual
                  </Button>
                </div>
              </div>
              <Separator />
              <h2>Usabilidade</h2>
              <div className="flex flex-col gap-2 pr-3">
                <PlanItem title="5 membros" />
                <PlanItem title="Aplicativos gratuitos" />
                <PlanItem title="Suporte limitado" />
              </div>
            </div>
            <div className="rounded-md bg-zinc-50 pb-5">
              <Plan />
              <Separator />
              <div className="mt-16 flex flex-col gap-2 px-3">
                <PlanItem title="5 membros" />
                <PlanItem title="Aplicativos gratuitos" />
                <PlanItem title="Suporte limitado" />
              </div>
            </div>
            <div>
              <div className="space-y-3 pb-5 pl-3 pt-3">
                <h2 className="text-lg">Personalizado</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl">Consulte</span>
                </div>
                <div className="flex justify-center">
                  <Button className="w-full" variant="outline">
                    Entrar em contato
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="mt-16 flex flex-col gap-2 pl-3">
                <PlanItem title="5 membros" />
                <PlanItem title="Aplicativos gratuitos" />
                <PlanItem title="Suporte limitado" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
