// components/chat/ChatSidebar.tsx

import { useEffect, useState } from "react";
import { ChatWhatsAppService } from "@/services/chat_whatsapp";

type Contato = { id: string; nome: string; whatsapp: string; ultimoTexto?: string };

export default function ChatSidebar({
  chatId,
  selectedId,
  onSelect,
}: {
  chatId?: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [contatos, setContatos] = useState<Contato[]>([]);

  useEffect(() => {
    if (!chatId) return;
    const fetchContatos = async () => {
      try {
        const contatos = await ChatWhatsAppService.listarContatos(chatId);
        if (!contatos) return;

        setContatos(
          contatos.map((c: any) => ({
            id: c.contact_id,
            nome: c.nome,
            whatsapp: c.whatsapp,
            ultimoTexto: "",
          }))
        );
      } catch (err) {
        console.error("Erro ao carregar contatos:", err);
      }
    };
    fetchContatos();
  }, [chatId]);

  return (
    <div className="w-64 border-r bg-muted overflow-y-auto">
      <div className="p-4 font-semibold border-b text-lg">📞 Contatos</div>
      {contatos.map((c) => (
        <div
          key={c.id}
          className={`p-4 cursor-pointer hover:bg-accent ${selectedId === c.id ? "bg-accent" : ""}`}
          onClick={() => onSelect(c.id)}
        >
          <div className="font-medium">{c.nome}</div>
          <div className="text-sm text-muted-foreground truncate">{c.ultimoTexto}</div>
        </div>
      ))}
    </div>
  );
}
