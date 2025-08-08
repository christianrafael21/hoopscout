"use client"

import Link from "next/link"
import { ShoppingBasketIcon as Basketball } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white text-black">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl font-bold">HoopScout</span>
        <Basketball className="w-6 h-6" />
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/about" className="hover:text-gray-600">
          Sobre nós
        </Link>
        <Link href="/how-it-works" className="hover:text-gray-600">
          Como funciona?
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 hover:text-gray-600">
            Tipos <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuItem>
              <Link href="/types/athlete" className="w-full text-black">
                Seja Atleta
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/types/judge" className="w-full text-black">
                Seja Treinador
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/">
          <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
            Entrar
          </Button>
        </Link>
        <Link href="/cadastro">
          <Button className="bg-black text-white hover:bg-black/90">Inscreva-se</Button>
        </Link>
      </div>
    </nav>
  )
}

