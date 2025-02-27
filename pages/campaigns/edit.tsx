// File: pages/campaigns/edit.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from "@/types/campaign";

export default function EditCampaignPage() {
  const [campaign, setCampaign] = useState<
    Omit<Campaign, "id" | "account_id" | "created_at" | "updated_at">
  >({
    name: "",
    description: "",
    channels: { email: { template: "", priority: 1 }, whatsapp: { template: "", priority: 2 } },
    filters: {
      tags: [],
      gender: "",
      birth_date_range: { start: "", end: "" }, // 🔥 Agora `end` sempre é uma string válida
    },
    status: "pendente",
  });

  const [emailTemplates, setEmailTemplates] = useState<{ id: string; name: string }[]>([]);
  const [whatsappTemplates, setWhatsappTemplates] = useState<{ id: string; name: string }[]>([]);

  const router = useRouter();
  const { id } = router.query;
  const isEditing = Boolean(id);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // 🔍 Buscar templates de Email e WhatsApp separadamente
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/templates?channel=email`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmailTemplates(res.data))
      .catch((err) => console.error("Erro ao carregar templates de email", err));

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/templates?channel=whatsapp`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWhatsappTemplates(res.data))
      .catch((err) => console.error("Erro ao carregar templates de WhatsApp", err));

    // 🔍 Se for edição, buscar dados da campanha
    if (isEditing && id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setCampaign((prev) => ({
            ...prev,
            name: res.data.name || "",
            description: res.data.description || "",
            channels: res.data.channels || prev.channels,
            filters: res.data.filters || prev.filters,
            status: res.data.status || "pendente",
          }));
        })
        .catch(() => router.push("/campaigns"));
    }
  }, [id, isEditing, router]);

  const saveCampaign = async () => {
    const token = localStorage.getItem("token");

    // 🔥 Limpa o JSON antes de enviar
    const cleanCampaign = {
      ...campaign,
      channels: Object.fromEntries(
        Object.entries(campaign.channels).map(([key, value]) => [
          key,
          { template: value.template || undefined, priority: value.priority },
        ])
      ),
    };

    try {
      if (isEditing) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}`, cleanCampaign, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`, cleanCampaign, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      router.push("/campaigns");
    } catch (error) {
      console.error("Erro ao salvar campanha", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {isEditing ? "Editar Campanha" : "Nova Campanha"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={campaign.name}
            onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
            placeholder="Nome da Campanha"
          />
          <Input
            value={campaign.description || ""}
            onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
            placeholder="Descrição"
            className="mt-2"
          />

          {/* Seletor de Templates */}
          <label className="block mt-4">Template Email:</label>
          <select
            className="w-full p-2 border rounded"
            value={campaign.channels.email.template}
            onChange={(e) =>
              setCampaign((prev) => ({
                ...prev,
                channels: {
                  ...prev.channels,
                  email: { ...prev.channels.email, template: e.target.value },
                },
              }))
            }
          >
            <option value="">Selecione um template</option>
            {emailTemplates.length > 0 ? (
              emailTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))
            ) : (
              <option disabled>Nenhum template disponível</option>
            )}
          </select>

          <label className="block mt-4">Template WhatsApp:</label>
          <select
            className="w-full p-2 border rounded"
            value={campaign.channels.whatsapp?.template}
            onChange={(e) =>
              setCampaign((prev) => ({
                ...prev,
                channels: {
                  ...prev.channels,
                  whatsapp: { ...prev.channels.whatsapp, template: e.target.value },
                },
              }))
            }
          >
            <option value="">Selecione um template</option>
            {whatsappTemplates?.length > 0 ? (
              whatsappTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))
            ) : (
              <option disabled>Nenhum template disponível</option>
            )}
          </select>

          {/* Campo de Status */}
          <label className="block mt-4">Status da Campanha:</label>
          <select
            className="w-full p-2 border rounded"
            value={campaign.status}
            onChange={(e) =>
              setCampaign((prev) => ({
                ...prev,
                status: e.target.value as "pendente" | "ativa" | "concluida",
              }))
            }
          >
            <option value="pendente">Pendente</option>
            <option value="ativa">Ativa</option>
            <option value="concluida">Concluída</option>
          </select>

          {/* Filtros: Tags */}
          <label className="block mt-4">Tags:</label>
          <Input
            value={campaign.filters.tags?.join(", ")}
            onChange={(e) =>
              setCampaign((prev) => ({
                ...prev,
                filters: {
                  ...prev.filters,
                  tags: e.target.value.split(",").map((tag) => tag.trim()),
                },
              }))
            }
            placeholder="Ex: vip, cliente_fiel"
          />

          {/* Filtros: Gênero */}
          <label className="block mt-4">Gênero:</label>
          <select
            className="w-full p-2 border rounded"
            value={campaign.filters.gender || ""}
            onChange={(e) =>
              setCampaign((prev) => ({
                ...prev,
                filters: { ...prev.filters, gender: e.target.value || undefined },
              }))
            }
          >
            <option value="">Todos</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>

          {/* Filtros: Data de Nascimento */}
          <label className="block mt-4">Data de Nascimento (Início):</label>
          <Input
            type="date"
            value={campaign.filters.birth_date_range?.start}
            onChange={(e) =>
              setCampaign((prev) => ({
                ...prev,
                filters: {
                  ...prev.filters,
                  birth_date_range: {
                    ...prev.filters.birth_date_range,
                    start: e.target.value,
                    end: prev.filters.birth_date_range?.end || "", // Ensure end is always a string
                  },
                },
              }))
            }
          />

          <label className="block mt-4">Data de Nascimento (Fim):</label>
          <Input
            type="date"
            value={campaign.filters.birth_date_range?.end || ""}
            onChange={(e) =>
              setCampaign((prev) => ({
                ...prev,
                filters: {
                  ...prev.filters,
                  birth_date_range: {
                    ...prev.filters.birth_date_range,
                    end: e.target.value,
                    start: prev.filters.birth_date_range?.start || "", // Ensure start is always a string
                  },
                },
              }))
            }
          />

          <Button onClick={saveCampaign} className="w-full mt-4">
            {isEditing ? "Salvar Alterações" : "Criar Campanha"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
