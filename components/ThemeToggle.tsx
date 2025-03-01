// File: components/ThemeToggle.tsx

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // 🔹 Importando o botão do theme

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <Button
      variant="outline" // 🔹 Mantém um visual consistente com o theme
      size="icon" // 🔹 Usa o tamanho de botão apropriado
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </Button>
  );
}
