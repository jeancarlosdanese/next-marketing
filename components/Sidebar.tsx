// File: /components/Sidebar.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen p-4 bg-background text-foreground dark:bg-gray-900 dark:text-white">
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
    </aside>
  );
}
