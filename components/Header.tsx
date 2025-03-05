// File: components/Header.tsx

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import ThemeToggle from "./ThemeToggle";
import { Menu } from "lucide-react";

type HeaderProps = {
  toggleSidebar: () => void;
  title?: string;
};

export function Header({ toggleSidebar, title }: HeaderProps) {
  const { user, logout } = useUser();

  return (
    <header className="flex justify-between items-center p-4 bg-background border-b">
      {/* 🔹 Botão de menu para abrir a Sidebar no mobile */}
      <Button variant="ghost" className="sm:hidden" onClick={toggleSidebar}>
        <Menu className="w-6 h-6" />
      </Button>

      {/* 🔹 Título da Página */}
      <h1 className="text-xl font-semibold text-center flex-1">{title}</h1>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-800 rounded-full text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm">{user.email}</p>
          </div>
        ) : (
          <p className="text-sm text-red-500">Não autenticado</p>
        )}

        <ThemeToggle />

        <Button variant="outline" onClick={logout}>
          Sair
        </Button>
      </div>
    </header>
  );
}
