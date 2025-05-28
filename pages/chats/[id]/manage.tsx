// File: pages/chats/[id]/manage.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChatWhatsAppService } from "@/services/chat_whatsapp";
import { ChatCreateDTO } from "@/types/chats";
import { PromptAIEditor } from "@/components/PromptAIEditor";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/badge";
import { getValidSessionStatusKey, sessionStatusIcons } from "@/utils/sessionStatusIcons";
import SessionStatusBadge from "@/components/chat/SessionStatusBadge";

const ManageChatPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useUser();

  const [chat, setChat] = useState<ChatCreateDTO>({
    department: "",
    title: "",
    instructions: "",
    phone_number: "",
    instance_name: "",
    webhook_url: "",
    session_status: "",
  });

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dados");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
    if (typeof id === "string" && id !== "new") setIsReady(true);
  }, [loading, user, id]);

  useEffect(() => {
    if (!isReady || !user) return;

    ChatWhatsAppService.buscarChat(id as string)
      .then(setChat)
      .catch((err) => {
        toast.error("Erro ao carregar chat.");
        console.error(err);
        router.push("/chats");
      });
  }, [id, isReady, user]);

  const handleChange = (field: keyof ChatCreateDTO, value: string) => {
    setChat((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await ChatWhatsAppService.atualizarChat(id as string, chat);
      toast.success("Chat atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar o chat.");
      console.error(err);
    }
  };

  const iniciarSessao = async () => {
    try {
      await ChatWhatsAppService.iniciarSessao(id as string);
      toast.success("Sessão iniciada. Verificando QR Code...");
      setTimeout(carregarQrCode, 1000);
    } catch (err) {
      toast.error("Erro ao iniciar sessão WhatsApp.");
      console.error(err);
    }
  };

  const carregarQrCode = async () => {
    try {
      const qr = await ChatWhatsAppService.obterQrCode(id as string);
      setQrCode(qr || null);
    } catch (err) {
      console.error("Erro ao obter QR Code:", err);
    }
  };

  if (loading || !user || !isReady) return <Spinner />;

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciar Chat / Setor</h1>
        {/* 🔹 Botão de Voltar */}
        <div className="flex justify-end mt-6 gap-2">
          <Button variant="default" onClick={() => router.push("/chats")}>
            Voltar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dados" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex flex-wrap justify-between gap-2 mb-4 h-auto">
          <TabsTrigger className="flex-1 min-w-[120px] border-b-2 border-gray-500" value="dados">
            📝 Dados
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 min-w-[120px] border-b-2 border-gray-500"
            value="instrucoes"
          >
            🤖 Instruções IA
          </TabsTrigger>
          <TabsTrigger className="flex-1 min-w-[120px] border-b-2 border-gray-500" value="sessao">
            📶 Sessão WhatsApp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados">
          <div className="space-y-4">
            <Input
              placeholder="Departamento"
              value={chat.department}
              onChange={(e) => handleChange("department", e.target.value)}
            />
            <Input
              placeholder="Título do setor"
              value={chat.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            <Input
              placeholder="Número principal (WhatsApp)"
              value={chat.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
            />
            <Input
              placeholder="Instância (ex: vendas_hyberica)"
              value={chat.instance_name}
              onChange={(e) => handleChange("instance_name", e.target.value)}
            />
            <Input
              placeholder="Webhook URL"
              value={chat.webhook_url}
              onChange={(e) => handleChange("webhook_url", e.target.value)}
            />

            <div className="flex flex-row gap-4 justify-start">
              <Button onClick={handleSubmit}>Salvar</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="instrucoes">
          <PromptAIEditor
            value={chat.instructions}
            onChange={(value) => handleChange("instructions", value)}
            className="mb-6"
          />
          <div className="flex flex-row gap-4 justify-start">
            <Button onClick={handleSubmit}>Salvar Instruções</Button>
          </div>
        </TabsContent>

        <TabsContent value="sessao">
          {chat.session_status !== "conectado" ? (
            <div className="flex flex-row gap-4 justify-start">
              <Button onClick={iniciarSessao}>Iniciar Sessão WhatsApp</Button>
              {qrCode && (
                <img src={qrCode} alt="QR Code" className="w-52 h-52 border rounded-md shadow" />
              )}
            </div>
          ) : (
            <div className="flex items-center py-6">
              <SessionStatusBadge status={chat.session_status} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Container>
  );
};

// Define o Layout global para a página
ManageChatPage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default ManageChatPage;
