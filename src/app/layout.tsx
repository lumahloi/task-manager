import './globals.css'
import type { Metadata } from 'next'

import Provider from "@/app/_trpc/Provider";

import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'App made to manage tasks.',
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
