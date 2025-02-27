// File: pages/campaigns/new.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from "@/types/campaign"; // Importa o tipo

export default function NewCampaignPage() {
  const [campaign, setCampaign] = useState<
    Omit<Campaign, "id" | "account_id" | "status" | "created_at" | "updated_at">
  >({
    name: "",
    description: "",
    channels: { email: { template: "", priority: 1 }, whatsapp: { template: "", priority: 2 } },
    filters: { tags: [], gender: "", birth_date_range: { start: "", end: "" } },
  });
  const [emailTemplates, setEmailTemplates] = useState<{ id: string; name: string }[]>([]);
  const [whatsappTemplates, setWhatsappTemplates] = useState<{ id: string; name: string }[]>([]);

  const router = useRouter();

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
  }, [router]);

  const cleanCampaign = {
    ...campaign,
    channels: Object.fromEntries(
      Object.entries(campaign.channels).map(([key, value]) => [
        key,
        {
          template: value.template ? value.template : undefined, // 🔥 Remove strings vazias
          priority: value.priority,
        },
      ])
    ),
  };

  const createCampaign = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`, cleanCampaign, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/campaigns");
    } catch (error) {
      console.error("Erro ao criar campanha", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Nova Campanha</CardTitle>
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
            value={campaign.channels.whatsapp.template}
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

          <Button onClick={createCampaign} className="w-full mt-4">
            Criar Campanha
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
