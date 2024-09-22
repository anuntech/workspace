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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, Trash2 } from "lucide-react";
import { RenderWorkspaces } from "./_components/render-workspaces";

export default function WorkspacesPage() {
  return (
    <main className="flex flex-col items-center p-10">
      <div className="w-full max-w-2xl space-y-5">
        <h1 className="text-2xl">Workspaces</h1>
        <Separator />
        <section>
          <h2 className="text-lg font-bold">Meus workspaces</h2>
          <span className="text-sm text-zinc-500">
            Gerencie seus workspaces e colabore com sua equipe de forma
            eficiente.
          </span>
        </section>
        <RenderWorkspaces />
      </div>
    </main>
  );
}
