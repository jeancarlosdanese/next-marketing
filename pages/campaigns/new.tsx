// File: pages/campaigns/new.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignService } from "@/services/campaign";
import { Template } from "@/types/template";
import { TemplateService } from "@/services/template";

export default function NewCampaignPage() {
  const [campaign, setCampaign] = useState({
    name: "",
    description: "",
    channels: { email: { template: "", priority: 1 }, whatsapp: { template: "", priority: 2 } },
    filters: { tags: [], gender: "", birth_date_range: { start: "", end: "" } },
  });

  const [emailTemplates, setEmailTemplates] = useState<Template[]>([]);
  const [whatsappTemplates, setWhatsappTemplates] = useState<Template[]>([]);

  const router = useRouter();

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setEmailTemplates(await TemplateService.getByChannel("email"));
        setWhatsappTemplates(await TemplateService.getByChannel("whatsapp"));
      } catch (error) {
        console.error("Erro ao carregar templates", error);
      }
    }

    fetchTemplates();
  }, []);

  const cleanCampaign = {
    ...campaign,
    channels: Object.fromEntries(
      Object.entries(campaign.channels)
        .filter(([_, value]) => value.template) // ✅ Remove canais sem template
        .map(([key, value]) => [
          key,
          { template: value.template as string, priority: value.priority }, // ✅ Garante que template é string
        ])
    ),
  };

  const createCampaign = async () => {
    // ✅ Verifica se ao menos um canal possui template selecionado
    const hasValidTemplate = Object.values(cleanCampaign.channels).some(
      (channel) => channel.template && channel.template.trim() !== ""
    );

    if (!hasValidTemplate) {
      alert("Por favor, selecione ao menos um template (Email ou WhatsApp).");
      return;
    }

    try {
      await CampaignService.create(cleanCampaign);
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
