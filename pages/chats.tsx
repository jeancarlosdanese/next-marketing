// File: pages/chats.tsx

import { useEffect, useState } from "react";
import { ChatWhatsAppService } from "@/services/chat_whatsapp";
import { Chat } from "@/types/chats";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/router";
import { getValidSessionStatusKey, sessionStatusIcons } from "@/utils/sessionStatusIcons";
import { formatPhoneNumber } from "@/utils/formaters";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/Container";
import SessionStatusBadge from "@/components/chat/SessionStatusBadge";

export default function ChatListPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await ChatWhatsAppService.listarChats();
        setChats(data);
      } catch (error) {
        console.error("Erro ao carregar chats:", error);
      }
    };

    fetchChats();
  }, []);

  if (chats.length === 0) return null;

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">📋 Chats WhatsApp</h1>
          <Button onClick={() => router.push("/chats/create")}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Chat
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chats.map((chat) => (
            <Card key={chat.id}>
              <CardHeader>
                <CardTitle>{chat.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Setor: {chat.department.charAt(0).toUpperCase() + chat.department.slice(1)}</p>
                <p>Número: {formatPhoneNumber(chat.phone_number)}</p>
                <p>
                  Instância: <span className="font-bold">{chat.instance_name}</span>
                </p>
                {/* Exibe o status do Chat */}
                <div className="flex items-center pt-6 pb-2">
                  <SessionStatusBadge status={chat.session_status} />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/chats/${chat.id}/manage`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/chat-whatsapp?id=${chat.id}`);
                    }}
                  >
                    Acessar Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}

ChatListPage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;
