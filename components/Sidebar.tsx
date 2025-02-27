// File: /components/Sidebar.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Next-Marketing</h2>
      <nav className="space-y-4">
        <Link href="/dashboard">
          <Button variant="ghost" className="w-full">
            Dashboard
          </Button>
        </Link>
        <Link href="/campaigns">
          <Button variant="ghost" className="w-full">
            Campanhas
          </Button>
        </Link>
        <Link href="/contacts">
          <Button variant="ghost" className="w-full">
            Contatos
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost" className="w-full">
            Configurações
          </Button>
        </Link>
      </nav>
    </div>
  );
}
