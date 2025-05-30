// File: components/chat/ChatWindowMobile.tsx

import { useEffect, useState, useRef } from "react";
import { Chat } from "@/types/chats";
import { ChatMessage } from "@/types/chat_messages";
import { ChatWhatsAppService } from "@/services/chat_whatsapp";
import ChatMessageItem from "./ChatMessageItem";
import ChatAISuggestion from "./ChatAISuggestion";
import ChatInput from "./ChatInput";
import { Button } from "@/components/ui/button";
import { Contact } from "@/types/contact";
import { ContactService } from "@/services/contact";

interface Props {
  chat: Chat | null;
  contactId: string | null;
  onVoltar: () => void;
}

export default function ChatWindowMobile({ chat, contactId, onVoltar }: Props) {
  const [contact, setContato] = useState<Contact | null>(null);
  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sugestaoIA, setSugestaoIA] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contactId) {
      ContactService.getById(contactId).then((contact) => {
        setContato(contact);
      });
    }
  }, [contactId]);

  useEffect(() => {
    if (!chat?.id || !contactId) return;
    ChatWhatsAppService.listarMensagens(chat.id, contactId).then((msgs) => {
      setMensagens(msgs);
      scrollToBottom();
    });
  }, [chat?.id, contactId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const gerarSugestao = async () => {
    if (!chat?.id || !contactId || !input) return;
    const sugestao = await ChatWhatsAppService.sugestaoRespostaAI(input, contactId, chat.id);
    setSugestaoIA(sugestao);
  };

  const enviarMensagem = async (texto: string) => {
    if (!chat?.id || !contactId) return;
    const msg = await ChatWhatsAppService.enviarMensagem(chat.id, contactId, {
      actor: "atendente",
      type: "texto",
      content: texto,
    });
    setMensagens((prev) => [...prev, msg]);
    setInput("");
    setSugestaoIA("");
    scrollToBottom();
  };

  if (!chat || !contact) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Cabeçalho */}
      <div className="p-4 border-b flex items-center justify-between gap-2 bg-background">
        <h2 className="font-semibold text-sm truncate">
          {contact && contact.name ? `${contact.name}` : `${contact.whatsapp}`}
        </h2>
        <Button variant="ghost" size="sm" onClick={onVoltar}>
          ← Voltar
        </Button>
      </div>

      {/* Mensagens */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50 dark:bg-zinc-900"
      >
        {mensagens.map((msg) => (
          <ChatMessageItem key={msg.id} msg={msg} />
        ))}
        {sugestaoIA && (
          <ChatAISuggestion
            sugestao={sugestaoIA}
            onEnviar={() => enviarMensagem(sugestaoIA)}
            onEditar={() => {
              setInput(sugestaoIA);
              setSugestaoIA("");
            }}
            onIgnorar={() => setSugestaoIA("")}
          />
        )}
      </div>

      {/* Campo de entrada */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={() => enviarMensagem(input)}
        onIA={gerarSugestao}
        disabled={!input}
        className="border-t p-2 bg-zinc-50 dark:bg-zinc-900"
      />
    </div>
  );
}
