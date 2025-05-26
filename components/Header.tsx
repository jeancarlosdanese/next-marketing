// File: components/Header.tsx

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import ThemeToggle from "./ThemeToggle";
import { LogOut } from "lucide-react";

type HeaderProps = {
  title?: string;
};

export function Header({ title }: HeaderProps) {
  const { user, logout } = useUser();

  return (
    <header className="flex justify-between items-center p-4 bg-background border-b">
      {/* 🔹 Título da Página */}
      <h1 className="text-xl font-semibold text-center flex-1">{title}</h1>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-muted text-foreground rounded-full text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-500">Não autenticado</p>
        )}

        <ThemeToggle />

        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => {
            logout();
          }}
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </header>
  );
}
