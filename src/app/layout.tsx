import './globals.css'
import type { Metadata } from 'next'

import Provider from "@/app/_trpc/Provider";

import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: 'Gerenciador de Tarefas',
  description: 'App criado par auxiliar na organização de tarefas.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className="dark">
      <body>
        <Provider>{children}</Provider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
