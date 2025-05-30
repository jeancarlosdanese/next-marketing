// File: pages/chats/new.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import LayoutForm from "@/components/LayoutForm";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChatCreateDTO } from "@/types/chats";
import { ChatWhatsAppService } from "@/services/chat_whatsapp";

const NewChatPage = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ChatCreateDTO>({
    department: "",
    title: "",
    instructions: "",
    phone_number: "",
    instance_name: "",
    webhook_url: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user]);

  const handleChange = (field: keyof ChatCreateDTO, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.department || !form.title || !form.phone_number || !form.instance_name) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await ChatWhatsAppService.criarChat(form);
      toast.success("Chat criado com sucesso!");
      router.push("/chats");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar o chat.");
      setError("Erro ao salvar. Tente novamente.");
    }
  };

  if (loading || !user) return <Spinner />;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6 sm:mb-4">Novo Chat / Setor</h1>

      <LayoutForm onSave={handleSubmit}>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <label className="block mt-3 sm:mt-4">Departamento:</label>
        <Input
          placeholder="financeiro, comercial, suporte..."
          value={form.department}
          onChange={(e) => handleChange("department", e.target.value)}
        />

        <label className="block mt-3 sm:mt-4">Título:</label>
        <Input
          placeholder="Ex: Vendas - Hyberica"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <label className="block mt-3 sm:mt-4">Número principal (WhatsApp):</label>
        <Input
          placeholder="Ex: 554999999999"
          value={form.phone_number}
          onChange={(e) => handleChange("phone_number", e.target.value)}
        />

        <label className="block mt-3 sm:mt-4">Identificador da Instância (slug único):</label>
        <Input
          placeholder="Ex: vendas_hyberica"
          value={form.instance_name}
          onChange={(e) => handleChange("instance_name", e.target.value)}
        />

        <label className="block mt-3 sm:mt-4">Webhook URL (opcional):</label>
        <Input
          placeholder="https://seu-servidor.com/webhook"
          value={form.webhook_url}
          onChange={(e) => handleChange("webhook_url", e.target.value)}
        />

        <label className="block mt-3 sm:mt-4">Instruções para IA:</label>
        <Textarea
          placeholder="Ex: Você é um atendente do setor COMERCIAL da empresa HYBERICA..."
          value={form.instructions}
          onChange={(e) => handleChange("instructions", e.target.value)}
        />
      </LayoutForm>
    </div>
  );
};

NewChatPage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default NewChatPage;
