import { spaceMono } from "./fonts"
import "./globals.css"
import type React from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={spaceMono.className}>{children}</body>
    </html>
  )
}

