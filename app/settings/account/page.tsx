import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function AccountPage() {
  return (
    <div className="flex flex-col items-center p-10">
      <div className="w-full max-w-3xl space-y-5">
        <form action="POST">
          <h1 className="text-2xl">Minhas configurações</h1>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>Avatar</p>
              <span className="text-sm text-muted-foreground">
                Isso será exibido no seu perfil público.
              </span>
            </div>
            <div className="flex justify-end pr-12">
              <Carousel className="w-full max-w-52" opts={{ loop: true }}>
                <CarouselContent>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                      <div className="flex aspect-square items-center justify-center rounded-md border p-6">
                        <span className="text-4xl font-semibold">
                          {index + 1}
                        </span>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </section>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>Nome</p>
              <span className="text-sm text-muted-foreground">
                Isso será exibido no seu perfil público.
              </span>
            </div>
            <div className="flex justify-end">
              <Input placeholder="Nome..." value="Kauan Ketner" />
            </div>
          </section>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>Nome de usuário</p>
              <span className="text-sm text-muted-foreground">
                Isso será exibido no seu perfil público.
              </span>
            </div>
            <div className="flex justify-end">
              <Input placeholder="Nome de usuário..." value="kauanketner" />
            </div>
          </section>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>E-mail</p>
              <span className="text-sm text-muted-foreground">
                Seu e-mail é usado para entrar na sua conta e para nós enviarmos
                comunicações importantes.
              </span>
            </div>
            <div className="flex justify-end">
              <Input placeholder="E-mail..." value="kauan@anuntech.com" />
            </div>
          </section>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p>Senha</p>
              <span className="text-sm text-muted-foreground">
                Defina ou atualize sua senha para manter sua conta segura.
              </span>
            </div>
            <div className="flex justify-end">
              <Input placeholder="Senha..." value="*******" />
            </div>
          </section>
          <Separator />
          <section className="grid grid-cols-2 gap-8 py-5">
            <div>
              <p className="text-red-500">Deletar conta</p>
              <span className="text-sm text-muted-foreground">
                Essa ação é irreversível e resultará na perda de todos os seus
                dados e acessos.
              </span>
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="destructive">
                Deletar conta
              </Button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
