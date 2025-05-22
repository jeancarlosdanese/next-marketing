// pages/chat-whatsapp.tsx

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Sparkles, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { ChatWhatsAppService } from "@/services/chat_whatsapp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Chat } from "@/types/chats";
import { ChatMessage } from "@/types/chat_messages";

// Tipagens

interface Contato {
  id: string;
  nome: string;
  whatsapp: string;
  ultimoTexto?: string;
}

export default function ChatWhatsAppPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatSelecionado, setChatSelecionado] = useState<Chat | null>(null);
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(null);
  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sugestaoIA, setSugestaoIA] = useState("");
  const [modoMobile, setModoMobile] = useState("lista");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Carrega chats da conta
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

  // 🔹 Carrega contatos do chat selecionado
  useEffect(() => {
    const carregarContatos = async () => {
      if (!chatSelecionado?.id) return;

      try {
        const contatos = await ChatWhatsAppService.listarContatos(chatSelecionado.id);
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
    carregarContatos();
  }, [chatSelecionado]);

  useEffect(() => {
    const carregarMensagens = async () => {
      if (!contatoSelecionado || !chatSelecionado) return;

      try {
        const historico = await ChatWhatsAppService.listarMensagens(
          chatSelecionado.id,
          contatoSelecionado.id
        );
        setMensagens(historico);
        setInput("");
        setSugestaoIA("");
      } catch (err) {
        console.error("Erro ao carregar mensagens:", err);
      }
    };

    carregarMensagens();
  }, [contatoSelecionado, chatSelecionado]);

  const gerarSugestao = async () => {
    if (!contatoSelecionado || !chatSelecionado || !input) return;

    try {
      const resposta = await ChatWhatsAppService.sugerirResposta(
        input,
        contatoSelecionado.id,
        chatSelecionado.id
      );
      setSugestaoIA(resposta);
    } catch (err) {
      console.error("Erro ao sugerir resposta da IA:", err);
    }
  };

  const enviarMensagem = async (texto: string) => {
    if (!contatoSelecionado || !chatSelecionado) return;

    try {
      const response = await ChatWhatsAppService.enviarMensagem(
        chatSelecionado.id,
        contatoSelecionado.id,
        {
          actor: "atendente",
          type: "texto",
          content: texto,
        }
      );

      setMensagens((prev) => [...prev, response]);
      setInput("");
      setSugestaoIA("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  const renderListaContatos = () => (
    <div className="w-full sm:w-64 border-r bg-background">
      <div className="p-4 text-lg font-semibold border-b">📞 Contatos</div>
      {contatos.map((c) => (
        <div
          key={c.id}
          onClick={() => {
            setContatoSelecionado(c);
            if (isMobile) setModoMobile("conversa");
          }}
          className={`p-4 cursor-pointer hover:bg-muted ${
            contatoSelecionado?.id === c.id ? "bg-muted" : ""
          }`}
        >
          <div className="font-medium">{c.nome}</div>
          <div className="text-sm text-muted-foreground truncate">{c.ultimoTexto}</div>
        </div>
      ))}
    </div>
  );

  const renderConversa = () => (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b text-lg font-semibold flex items-center gap-2">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setModoMobile("lista")}>
            {" "}
            <ArrowLeft className="w-4 h-4" />{" "}
          </Button>
        )}
        💬 {contatoSelecionado?.nome || "Selecione um contato"}
      </div>
      <div className="flex-1 p-4 space-y-3 bg-muted overflow-y-auto">
        {mensagens?.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-md rounded-md p-3 text-sm ${
              msg.actor === "cliente"
                ? "bg-background border"
                : msg.actor === "ai"
                  ? "bg-yellow-100 border border-yellow-300"
                  : "bg-green-100 text-green-800"
            }`}
          >
            <div className="text-xs font-semibold uppercase mb-1">{msg.actor}</div>
            {msg.content}
            <div className="text-[10px] text-right text-muted-foreground mt-1">
              {new Date(msg.created_at).toLocaleTimeString()}
            </div>
          </div>
        ))}

        {/* Sugestão da IA (se houver) */}
        {sugestaoIA && (
          <Card className="bg-yellow-50 border-yellow-300">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-900 mb-2">🤖 Sugestão da IA:</p>
              <p className="whitespace-pre-line text-sm">{sugestaoIA}</p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={() => enviarMensagem(sugestaoIA)}>
                  Enviar
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setInput(sugestaoIA);
                    setSugestaoIA("");
                  }}
                >
                  Editar
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setSugestaoIA("")}>
                  Ignorar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="border-t p-4 flex gap-2 bg-background">
        <Textarea
          placeholder="Digite a resposta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <div className="flex flex-col gap-2">
          <Button onClick={gerarSugestao} disabled={!input}>
            <Sparkles className="w-4 h-4 mr-1" /> IA
          </Button>
          <Button onClick={() => enviarMensagem(input)} disabled={!input}>
            <Send className="w-4 h-4 mr-1" /> Enviar
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="overflow-hidden">
        {/* Cabeçalho fixo com seletor de setor */}
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <h1 className="text-lg font-bold">🤖 Atendimento Inteligente</h1>
          <div className="flex items-center gap-2">
            <Select
              value={chatSelecionado?.id || ""}
              onValueChange={(id) => {
                const novo = chats.find((c) => c.id === id);
                if (novo) {
                  setChatSelecionado(novo);
                  setContatoSelecionado(null);
                  setMensagens([]);
                }
              }}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                {chats.map((chat) => (
                  <SelectItem key={chat.id} value={chat.id}>
                    {chat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conteúdo principal */}
        {isMobile ? (
          modoMobile === "lista" ? (
            renderListaContatos()
          ) : (
            renderConversa()
          )
        ) : (
          <div className="flex h-[calc(100vh-11rem)]">
            {renderListaContatos()}
            {renderConversa()}
          </div>
        )}
      </div>
    </Layout>
  );
}
