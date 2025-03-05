// File: components/Footer.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-muted text-muted-foreground text-sm text-center py-4 mt-6">
      <p>
        Next-Marketing v1.0.0 - Desenvolvido por{" "}
        <Link href="https://github.com/jeancarlosdanese/" target="_blank" className="underline">
          Jean Carlos Danese
        </Link>
      </p>
      <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
    </footer>
  );
}
