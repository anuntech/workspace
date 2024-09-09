'use client'

import { useState } from 'react'
import { Apple, Plus, Triangle, Turtle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const workspaces = [
  {
    label: 'Anuntech',
    id: 'workspace1',
    icon: <Triangle className="size-5" />,
  },
  {
    label: 'Apple',
    id: 'workspace2',
    icon: <Apple className="size-5" />,
  },
  {
    label: 'Turtle',
    id: 'workspace3',
    icon: <Turtle className="size-5" />,
  },
]

export function WorkspaceSwitcher() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>(
    workspaces[0]?.id || '',
  )

  function handleWorkspaceChange(id: string) {
    setSelectedWorkspace(id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          {
            workspaces.find((workspace) => workspace.id === selectedWorkspace)
              ?.icon
          }
          {
            workspaces.find((workspace) => workspace.id === selectedWorkspace)
              ?.label
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        {workspaces.map((workspace) => (
          <DropdownMenuGroup key={workspace.id}>
            <DropdownMenuItem
              className="gap-3"
              onClick={() => handleWorkspaceChange(workspace.id)}
            >
              {workspace.icon}
              {workspace.label}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-3">
          <Plus className="size-5" />
          Criar workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
