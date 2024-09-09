import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trash2 } from 'lucide-react'

export default function MembersPage() {
  return (
    <main className="flex flex-col items-center p-10">
      <div className="w-full max-w-3xl space-y-5">
        <h1 className="text-2xl">Membros</h1>
        <Separator />
        <Tabs defaultValue="members" className="space-y-10">
          <TabsList>
            <TabsTrigger value="members">Membros</TabsTrigger>
            <TabsTrigger value="invites">Convites</TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <div className="space-y-5">
              <section>
                <h2 className="text-lg font-bold">Membros do workspace</h2>
                <span className="text-sm text-zinc-500">
                  Convide os membros da sua equipe para colaborar.
                </span>
              </section>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/shad.png" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      João Oliveira
                    </p>
                    <p className="text-sm text-muted-foreground">
                      joao@anuntech.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="user">
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Selecione um cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="user">Usuário</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="group hover:border-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="size-4 group-hover:text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá
                          permanentemente o membro de seu workspace.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction>Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/shad.png" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      Kauan Ketner
                    </p>
                    <p className="text-sm text-muted-foreground">
                      kauan@anuntech.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="admin">
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Selecione um cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="user">Usuário</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="group hover:border-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="size-4 group-hover:text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá
                          permanentemente o membro de seu workspace.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction>Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="invites">
            <div className="space-y-5">
              <section>
                <h2 className="text-lg font-bold">Convidar para o workspace</h2>
                <span className="text-sm text-zinc-500">
                  Convide os membros da sua equipe para colaborar.
                </span>
              </section>
              <form className="flex gap-2">
                <Input placeholder="Insira o e-mail para convidar..." />
                <Button type="submit">Enviar convite</Button>
              </form>
              <Separator />
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/shad.png" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      Vinicius Domene
                    </p>
                    <p className="text-sm text-muted-foreground">
                      vinicius-domene@watecservice.com
                    </p>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="group hover:border-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="size-4 group-hover:text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá
                        permanentemente o membro de seu workspace.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/shad.png" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      Alexandre Domene
                    </p>
                    <p className="text-sm text-muted-foreground">
                      alexandre-domene@watecservice.com
                    </p>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="group hover:border-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="size-4 group-hover:text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá
                        permanentemente o membro de seu workspace.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
