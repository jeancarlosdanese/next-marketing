// components/chat/ChatWindow.tsx

import { useEffect, useState } from "react";
import ChatMessageItem from "./ChatMessage";
import ChatAISuggestion from "./ChatAISuggestion";
import ChatInput from "./ChatInput";
import { Chat } from "@/types/chats";
import { ChatMessage } from "@/types/chat_messages";
import { ChatWhatsAppService } from "@/services/chat_whatsapp";

interface Props {
  chat: Chat | null;
  contatoId: string | null;
}

export default function ChatWindow({ chat, contatoId }: Props) {
  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sugestaoIA, setSugestaoIA] = useState("");

  useEffect(() => {
    if (!chat?.id || !contatoId) return;
    const fetchMensagens = async () => {
      const result = await ChatWhatsAppService.listarMensagens(chat.id, contatoId);
      setMensagens(result);
      setInput("");
      setSugestaoIA("");
    };
    fetchMensagens();
  }, [chat?.id, contatoId]);

  const gerarSugestao = async () => {
    if (!input || !chat?.id || !contatoId) return;
    const sugestao = await ChatWhatsAppService.sugerirResposta(input, contatoId, chat.id);
    setSugestaoIA(sugestao);
  };

  const enviarMensagem = async (texto: string) => {
    if (!chat?.id || !contatoId) return;
    const msg = await ChatWhatsAppService.enviarMensagem(chat.id, contatoId, {
      actor: "atendente",
      type: "texto",
      content: texto,
    });
    setMensagens((prev) => [...prev, msg]);
    setInput("");
    setSugestaoIA("");
  };

  if (!chat || !contatoId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Selecione um contato
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-muted">
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
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={() => enviarMensagem(input)}
        onIA={gerarSugestao}
        disabled={!input}
      />
    </div>
  );
}
