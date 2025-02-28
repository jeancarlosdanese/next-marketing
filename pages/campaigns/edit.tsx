// File: pages/campaigns/edit.tsx

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CampaignService } from "@/services/campaign";
import { TemplateService } from "@/services/template";
import { Template } from "@/types/template";
import { Campaign } from "@/types/campaign";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditCampaignPage() {
  const { user, loading } = useUser();
  const [campaign, setCampaign] = useState<
    Omit<Campaign, "id" | "account_id" | "created_at" | "updated_at">
  >({
    name: "",
    description: "",
    channels: { email: { template: "", priority: 1 }, whatsapp: { template: "", priority: 2 } },
    filters: {
      tags: [],
      gender: "",
      birth_date_range: { start: "", end: "" },
    },
    status: "pendente",
  });

  const [emailTemplates, setEmailTemplates] = useState<Template[]>([]);
  const [whatsappTemplates, setWhatsappTemplates] = useState<Template[]>([]);

  const router = useRouter();
  const { id } = router.query;
  const isEditing = Boolean(id);

  // 🔹 Redirecionamento seguro dentro do useEffect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        // 🔹 Carregar templates
        setEmailTemplates(await TemplateService.getByChannel("email"));
        setWhatsappTemplates(await TemplateService.getByChannel("whatsapp"));

        // 🔹 Se for edição, buscar dados da campanha
        if (isEditing && id) {
          const data = await CampaignService.getById(id as string);
          setCampaign((prev) => ({
            ...prev,
            name: data.name || "",
            description: data.description || "",
            channels: data.channels || prev.channels,
            filters: data.filters || prev.filters,
            status: data.status || "pendente",
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar dados", error);
        router.push("/campaigns");
      }
    }

    fetchData();
  }, [id, isEditing, router]);

  const saveCampaign = async () => {
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

    try {
      if (isEditing) {
        await CampaignService.update(id as string, cleanCampaign);
      } else {
        await CampaignService.create(cleanCampaign);
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
            value={campaign.channels?.whatsapp?.template}
            onChange={(e) =>
              setCampaign((prev) => ({
                ...prev,
                channels: {
                  ...prev.channels,
                  whatsapp: { ...prev.channels?.whatsapp, template: e.target.value },
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

          {/* Status (Apenas Exibição) */}
          <label className="block mt-4">Status:</label>
          <Input value={campaign.status} disabled className="w-full p-2 border bg-gray-200" />
          {/* Campo de Status */}
          {/* <label className="block mt-4">Status da Campanha:</label>
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
          </select> */}

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
          <Button variant="outline" className="w-full" onClick={() => router.push("/campaigns")}>
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
