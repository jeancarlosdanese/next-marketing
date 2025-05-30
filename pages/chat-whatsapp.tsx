// pages/chat-whatsapp.tsx

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatContactListMobile from "@/components/chat/ChatContactListMobile";
import ChatWindowMobile from "@/components/chat/ChatWindowMobile";
import { ChatWhatsAppService } from "@/services/chat_whatsapp";
import { Chat } from "@/types/chats";
import { Container } from "@/components/ui/Container";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/Spinner";

const ChatWhatsAppPage = () => {
  const { user, loading } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatSelecionado, setChatSelecionado] = useState<Chat | null>(null);
  const [contatoSelecionado, setContatoSelecionado] = useState<string | null>(null);
  const [modoMobile, setModoMobile] = useState<"lista" | "conversa">("lista");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const verificarMobile = () => setIsMobile(window.innerWidth < 768);
    verificarMobile();
    window.addEventListener("resize", verificarMobile);
    return () => window.removeEventListener("resize", verificarMobile);
  }, []);

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
    const interval = setInterval(sincronizarStatus, 30000);
    return () => clearInterval(interval);
  }, [chatSelecionado]);

  if (loading) return <Spinner />;
  if (!user) return null;

  return (
    <Container>
      <div className="flex flex-col h-[calc(100vh-7rem)] bg-background text-foreground">
        <ChatHeader
          chats={chats}
          selected={chatSelecionado}
          onSelect={(chat) => {
            setChatSelecionado(chat);
            setContatoSelecionado(null);
            setModoMobile("lista");
          }}
        />

        {isMobile ? (
          modoMobile === "lista" ? (
            <ChatContactListMobile
              chatId={chatSelecionado?.id}
              selectedId={contatoSelecionado}
              onSelect={(id) => {
                setContatoSelecionado(id);
                setModoMobile("conversa");
              }}
            />
          ) : (
            <ChatWindowMobile
              chat={chatSelecionado}
              contactId={contatoSelecionado}
              onVoltar={() => setModoMobile("lista")}
            />
          )
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <ChatSidebar
              chatId={chatSelecionado?.id}
              selectedId={contatoSelecionado}
              onSelect={setContatoSelecionado}
            />
            <ChatWindow chat={chatSelecionado} chatContactId={contatoSelecionado} />
          </div>
        )}
      </div>
    </Container>
  );
};

ChatWhatsAppPage.getLayout = (page: JSX.Element) => (
  <Layout exibirRodape={false} modo="fixo">
    {page}
  </Layout>
);

export default ChatWhatsAppPage;
