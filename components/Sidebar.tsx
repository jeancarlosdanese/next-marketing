// File: /components/Sidebar.tsx

import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Home, FileText, Megaphone, Users, Settings, LogOut } from "lucide-react";
import { useUser } from "@/context/UserContext";

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const router = useRouter();
  const { user, logout } = useUser();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Templates", href: "/templates", icon: <FileText className="w-5 h-5" /> },
    { name: "Campanhas", href: "/campaigns", icon: <Megaphone className="w-5 h-5" /> },
    { name: "Contatos", href: "/contacts", icon: <Users className="w-5 h-5" /> },
    { name: "Configurações", href: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* 🔹 Overlay escuro só no mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 sm:hidden" onClick={toggleSidebar} />
      )}

      {/* 🔹 Sidebar - fundo claro no desktop, escuro no mobile */}
      <aside
        className={`fixed sm:relative w-64 min-h-screen p-4 z-50 transition-transform transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0
        bg-white dark:bg-gray-900 text-foreground shadow-lg sm:shadow-none`}
      >
        <h2 className="text-xl font-bold mb-6">Next-Marketing</h2>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={router.pathname === item.href ? "default" : "ghost"}
                className="w-full flex items-center justify-start gap-2"
              >
                {item.icon}
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        {user && (
          <Button
            variant="destructive"
            className="w-full mt-6 flex items-center justify-start gap-2"
            onClick={() => {
              logout();
              router.push("/auth/login");
            }}
          >
            <LogOut className="w-5 h-5" />
            Sair
          </Button>
        )}
      </aside>
    </>
  );
}
