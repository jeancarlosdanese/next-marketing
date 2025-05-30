// components/chat/ChatWindow.tsx

import { useEffect, useRef, useState } from "react";
import ChatMessageItem from "./ChatMessageItem";
import ChatAISuggestion from "./ChatAISuggestion";
import ChatInput from "./ChatInput";
import { Chat } from "@/types/chats";
import { ChatMessage } from "@/types/chat_messages";
import { ChatWhatsAppService } from "@/services/chat_whatsapp";

interface Props {
  chat: Chat | null;
  chatContactId: string | null;
}

export default function ChatWindow({ chat, chatContactId }: Props) {
  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sugestaoIA, setSugestaoIA] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // 🔁 Atualiza mensagens a cada 10 segundos
  useEffect(() => {
    if (!chat?.id || !chatContactId) return;

    const fetchMensagens = async () => {
      const result = await ChatWhatsAppService.listarMensagens(chat.id, chatContactId);
      setMensagens(result);
    };

    fetchMensagens(); // Inicial

    const interval = setInterval(fetchMensagens, 10000);
    return () => clearInterval(interval); // Cleanup
  }, [chat?.id, chatContactId]);

  // 🔄 Scroll automático
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensagens, sugestaoIA]);

  const gerarSugestao = async () => {
    if (!chat?.id || !chatContactId) return;
    const sugestao = await ChatWhatsAppService.sugestaoRespostaAI(input, chatContactId, chat.id);
    setSugestaoIA(sugestao);
  };

  const enviarMensagem = async (texto: string) => {
    if (!chat?.id || !chatContactId) return;
    const msg = await ChatWhatsAppService.enviarMensagem(chat.id, chatContactId, {
      actor: "atendente",
      type: "texto",
      content: texto,
    });
    setMensagens((prev) => [...prev, msg]);
    setInput("");
    setSugestaoIA("");
  };

  if (!chat || !chatContactId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Selecione um contato
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-zinc-50 dark:bg-zinc-800">
        {mensagens.map((msg) => (
          <ChatMessageItem key={msg.id} msg={msg} />
        ))}
        {sugestaoIA && (
          <ChatAISuggestion
            sugestao={sugestaoIA}
            onEnviar={(textoFinal) => enviarMensagem(textoFinal)}
            onIgnorar={() => setSugestaoIA("")}
          />
        )}
        <div ref={endRef} />
      </div>
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={() => enviarMensagem(input)}
        onIA={gerarSugestao}
        disabled={!input}
        className="border-t p-2 bg-zinc-50 dark:bg-zinc-800"
      />
    </div>
  );
}
