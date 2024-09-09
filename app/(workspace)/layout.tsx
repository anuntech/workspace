import { Sidebar } from './_components/sidebar'

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid h-screen grid-cols-[230px_1fr] overflow-hidden bg-zinc-50 py-3 pr-3">
      <Sidebar />
      <main className="overflow-auto rounded-md border bg-white">
        {children}
      </main>
    </div>
  )
}
