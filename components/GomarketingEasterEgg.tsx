// File: components/GomarketingEasterEgg.tsx

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";

const commandments = [
  "🧠 A IA é um copiloto, o ser humano é o piloto.",
  "🧱 Toda campanha começa com uma boa fundação de dados.",
  "📣 Cada mensagem tem um propósito — nunca envie por enviar.",
  "🔁 Feedback do usuário não é sugestão — é aprendizado para o sistema.",
  "🧬 Personalização não é luxo — é requisito para conversão.",
  "⚙️ O pipeline deve ser observável, resiliente e adaptável.",
  "💡 Prompts são código. Itere, documente e refine.",
  "🌍 Cada conta é um universo. GoMarketing é multiverso.",
  "🔐 Dados são sagrados. Segurança vem antes da conveniência.",
  "😂 Nunca subestime o poder de um easter egg bem colocado.",
];

export default function GomarketingEasterEgg() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key.toLowerCase() === "g") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === "g") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="fixed inset-0 z-50 p-6 bg-black bg-opacity-80 flex items-center justify-center"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-black">
        <h2 className="text-2xl font-bold mb-4 text-center">🥚 Os 10 Mandamentos do GoMarketing</h2>
        <ul className="space-y-2 text-sm">
          {commandments.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <Button onClick={() => setOpen(false)}>Fechar</Button>
        </div>
      </div>
    </Dialog>
  );
}
