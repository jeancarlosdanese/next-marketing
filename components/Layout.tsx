// File: components/Layout.tsx

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

type LayoutProps = {
  children: React.ReactNode;
  exibirRodape?: boolean;
  modo?: "rolavel" | "fixo";
};

export default function Layout({ children, exibirRodape = true, modo = "rolavel" }: LayoutProps) {
  const layoutClass = modo === "fixo" ? "h-screen overflow-hidden" : "min-h-screen";

  return (
    <div className={`flex flex-col bg-background text-foreground ${layoutClass}`}>
      <div className="flex flex-1 w-full">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-0">
          <Header />
          <main className="flex-grow w-full px-4 py-2 sm:p-6 overflow-y-auto">{children}</main>
        </div>
      </div>

      {exibirRodape ? (
        <Footer />
      ) : (
        <Footer className="h-0 opacity-0 overflow-hidden pointer-events-none select-none" />
      )}
    </div>
  );
}
