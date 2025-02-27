// File: components/ThemeToggle.tsx

import { useEffect, useState } from "react";

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
    <button
      className="p-2 bg-gray-200 dark:bg-gray-800 rounded-md text-black dark:text-white"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "☀️ Claro" : "🌙 Escuro"}
    </button>
  );
}
