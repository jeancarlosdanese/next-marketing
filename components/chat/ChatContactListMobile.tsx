import { useEffect, useState } from "react";
import { ChatWhatsAppService } from "@/services/chat_whatsapp";
import { ChatContactResumo } from "@/types/chat_whatsapp_contact";

interface Props {
  chatId?: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ChatContactListMobile({ chatId, selectedId, onSelect }: Props) {
  const [contatos, setContatos] = useState<ChatContactResumo[]>([]);

  useEffect(() => {
    if (!chatId) return;
    ChatWhatsAppService.listarChatContacts(chatId).then(setContatos);
  }, [chatId]);

  return (
    <div className="h-full overflow-y-auto bg-muted">
      <div className="p-4 font-semibold border-b text-lg">📞 Contatos</div>
      {contatos.map((c) => (
        <div
          key={c.contact_id}
          className={`p-4 cursor-pointer hover:bg-accent ${
            selectedId === c.contact_id ? "bg-accent" : ""
          }`}
          onClick={() => onSelect(c.contact_id)}
        >
          <div className="font-medium">{c.nome}</div>
          <div className="text-sm text-muted-foreground truncate">{c.whatsapp}</div>
        </div>
      ))}
    </div>
  );
}
