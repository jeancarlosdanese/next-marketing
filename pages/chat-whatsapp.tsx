// pages/chat-whatsapp.tsx

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { ChatWhatsAppService } from "@/services/chat_whatsapp";
import { Chat } from "@/types/chats";

const ChatWhatsAppPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatSelecionado, setChatSelecionado] = useState<Chat | null>(null);
  const [contatoSelecionado, setContatoSelecionado] = useState<string | null>(null);

  useEffect(() => {
    const carregarChats = async () => {
      try {
        const data = await ChatWhatsAppService.listarChats();
        setChats(data);
        if (data.length > 0) setChatSelecionado(data[0]);
      } catch (err) {
        console.error("Erro ao carregar chats:", err);
      }
    };
    carregarChats();
  }, []);

  // 🔄 Sincronização periódica do status da sessão
  useEffect(() => {
    if (!chatSelecionado?.id) return;

    const sincronizarStatus = async () => {
      try {
        const novoStatus = await ChatWhatsAppService.verificarStatusSessao(chatSelecionado.id);
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatSelecionado.id ? { ...chat, session_status: novoStatus.status } : chat
          )
        );
      } catch (err) {
        console.warn("Erro ao sincronizar status da sessão:", err);
      }
    };

    sincronizarStatus();
    const interval = setInterval(sincronizarStatus, 30000); // 30s
    return () => clearInterval(interval);
  }, [chatSelecionado]);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] bg-background text-foreground">
      <ChatHeader
        chats={chats}
        selected={chatSelecionado}
        onSelect={(chat) => {
          setChatSelecionado(chat);
          setContatoSelecionado(null);
        }}
      />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          chatId={chatSelecionado?.id}
          selectedId={contatoSelecionado}
          onSelect={setContatoSelecionado}
        />
        <ChatWindow chat={chatSelecionado} contatoId={contatoSelecionado} />
      </div>
    </div>
  );
};

// Define o Layout global para a página
ChatWhatsAppPage.getLayout = (page: JSX.Element) => (
  <Layout exibirRodape={false} modo="fixo">
    {page}
  </Layout>
);

export default ChatWhatsAppPage;
