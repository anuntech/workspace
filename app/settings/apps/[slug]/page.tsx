import Link from 'next/link'
import { ChevronLeft, CirclePlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function AppPage() {
  return (
    <div className="flex flex-col items-center p-10">
      <div className="w-full max-w-3xl space-y-5">
        <Link
          href="/settings/apps"
          className="flex w-max items-center gap-2 text-sm"
        >
          <ChevronLeft className="size-4" />
          Loja de aplicativos
        </Link>
        <section className="flex gap-3">
          <Avatar className="size-14">
            <AvatarImage src="/shad.png" />
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>GitHub</span>
            <span className="text-sm text-muted-foreground">
              Plataforma de hospedagem de código para controle de versão e
              colaboração.
            </span>
          </div>
        </section>
        <section className="space-y-5 rounded-md border p-5">
          <header className="flex justify-between">
            <div></div>
            <Button type="button">
              <CirclePlus className="mr-2 size-5" />
              Habilitar
            </Button>
          </header>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-52 rounded-md bg-zinc-300" />
            <div className="h-52 rounded-md bg-zinc-300" />
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <span>Visão geral</span>
              <p className="text-muted-foreground">
                This powerful GitLab integration keeps your work in sync in both
                applications. It links issues to Merge Requests so that issues
                update automatically from In Progress to Done as the MR moves
                from drafted to merged – there is no need to update the issue in
                Linear at all. Move even faster by using a keyboard shortcut
                that creates the issue&apos;s git branch name, assigns the issue
                and moves the issue to In Progress in one step.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
