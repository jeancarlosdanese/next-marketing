// components/chat/ChatSidebar.tsx

import { useEffect, useState } from "react";
import { ChatWhatsAppService } from "@/services/chat_whatsapp";
import { ChatContactFull } from "@/types/chat_contact";

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
  const [chatContacts, setChatContacts] = useState<ChatContactFull[]>([]);

  useEffect(() => {
    if (!chatId) return;
    const fetchContacts = async () => {
      try {
        const chatContacts = await ChatWhatsAppService.listarChatContacts(chatId);
        if (!chatContacts) return;

        setChatContacts(chatContacts);
      } catch (err) {
        console.error("Erro ao carregar chatContacts:", err);
      }
    };
    fetchContacts();
  }, [chatId]);

  return (
    <div className="w-full sm:w-64 border-r bg-zinc-50 dark:bg-zinc-900 overflow-y-auto">
      <div className="p-4 font-semibold border-b text-lg">📞 Contatos</div>
      {chatContacts.map((chatContact) => (
        <div
          key={chatContact.id}
          className={`p-4 cursor-pointer hover:bg-accent ${selectedId === chatContact.id ? "bg-accent" : ""}`}
          onClick={() => onSelect(chatContact.id)}
        >
          <div className="font-medium">{chatContact.name}</div>
          <div className="text-sm text-muted-foreground truncate">{chatContact.phone}</div>
        </div>
      ))}
    </div>
  );
}
