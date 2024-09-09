import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center p-10">
      <div className="w-full max-w-3xl space-y-5">
        <h1 className="text-2xl">Geral</h1>
        <Separator />
        <section className="grid grid-cols-2 gap-8 py-5">
          <div>
            <p>Avatar do workspace</p>
            <span className="text-sm text-muted-foreground">
              Escolha um avatar que será visível para todos e representará sua
              identidade digital.
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
            <p>Nome do workspace</p>
            <span className="text-sm text-muted-foreground">
              Digite o nome que será mostrado publicamente como identificação do
              seu workspace em todas as interações na plataforma.
            </span>
          </div>
          <div className="flex justify-end">
            <Input placeholder="Nome..." value="Anuntech" />
          </div>
        </section>
        <Separator />
        <section className="grid grid-cols-2 gap-8 py-5">
          <div>
            <p className="text-red-500">Deletar workspace</p>
            <span className="text-sm text-muted-foreground">
              Cuidado! Deletar seu workspace é uma ação permanente que removerá
              todos os dados, configurações e históricos associados, sem
              possibilidade de recuperação.
            </span>
          </div>
          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Deletar workspace</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Entre em contato com o suporte
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Para prosseguir com a exclusão do workspace, entre em
                    contato com nosso suporte. Eles irão ajudar você a concluir
                    essa ação de forma segura.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Ok</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </div>
    </div>
  )
}
