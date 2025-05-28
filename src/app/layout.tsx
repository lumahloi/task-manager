import './globals.css'
import type { Metadata } from 'next'

import Provider from "@/app/_trpc/Provider";

export const metadata: Metadata = {
  title: 'To Do App',
  description: 'To Do App made to help task and duty management.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
