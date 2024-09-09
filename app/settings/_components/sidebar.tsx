import Link from 'next/link'
import { Building, ChevronLeft, CircleUser } from 'lucide-react'
import { NavLink } from '@/app/(workspace)/_components/sidebar/nav-link'
import { Separator } from '@/components/ui/separator'

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-4 rounded-md px-2">
      <Link href="/" className="flex w-max items-center gap-2">
        <ChevronLeft className="size-4" />
        Voltar
      </Link>
      <Separator />
      <nav className="space-y-5">
        <div className="space-y-2">
          <span className="flex items-center gap-2 text-sm text-zinc-600">
            <Building className="size-4" />
            Workspace
          </span>
          <ul className="space-y-1 text-sm">
            <li>
              <NavLink href="/settings">Geral</NavLink>
            </li>
            <li>
              <NavLink href="/settings/apps">Loja de aplicativos</NavLink>
            </li>
            <li>
              <NavLink href="/settings/members">Membros</NavLink>
            </li>
            {/* <li>
              <NavLink href="/settings/roles">Cargos</NavLink>
            </li> */}
            <li>
              <NavLink href="/settings/plans">Planos</NavLink>
            </li>
            <li>
              <NavLink href="https://billing.stripe.com/p/login/test_00gg2ObKK5nm0lq8ww">
                Faturas
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <span className="flex items-center gap-2 text-sm text-zinc-600">
            <CircleUser className="size-4" />
            Minha conta
          </span>
          <ul className="space-y-1 text-sm">
            <li>
              <NavLink href="/settings/account">Minhas configurações</NavLink>
            </li>
            <li>
              <NavLink href="/settings/account/workspaces">Workspaces</NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  )
}
