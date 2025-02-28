// File: components/Header.tsx

import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  user?: { email: string } | null;
};

export function Header({ user }: HeaderProps) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <p className="text-sm">{user?.email ?? "Não autenticado"}</p>
        <ThemeToggle />
        <Button variant="outline" onClick={logout}>
          Sair
        </Button>
      </div>
    </div>
  );
}
