// File: pages/campaigns/edit.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import LayoutForm from "@/components/LayoutForm";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Campaign } from "@/types/campaign";
import { Template } from "@/types/template";
import { CampaignService } from "@/services/campaign";
import { TemplateService } from "@/services/template";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";

const EditCampaignPage = () => {
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const isEditing = Boolean(id);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && !user) return;

    async function fetchData() {
      try {
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
        toast.error("Erro ao carregar os dados.");
        router.push("/campaigns");
      }
    }

    fetchData();
  }, [loading, user, id, isEditing, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!campaign) return;
    setCampaign({ ...campaign, [e.target.name]: e.target.value });
  };

  const handleTagsChange = (value: string, resetInput: () => void) => {
    if (!value.trim()) return;
    setCampaign((prev) => ({
      ...prev!,
      filters: { ...prev!.filters, tags: [...(prev!.filters.tags || []), value.trim()] },
    }));

    resetInput();
  };

  const handleTagRemove = (tag: string) => {
    setCampaign((prev) => ({
      ...prev!,
      filters: { ...prev!.filters, tags: prev!.filters.tags.filter((t) => t !== tag) },
    }));
  };

  const handleSubmit = async () => {
    if (!campaign.name.trim()) {
      setError("O nome da campanha é obrigatório.");
      return;
    }

    if (Object.keys(campaign.channels).length === 0) {
      setError("Pelo menos um canal de comunicação é obrigatório.");
      return;
    }

    // 🔹 Remover canais sem template válido antes do envio
    const cleanCampaign = {
      ...campaign,
      channels: Object.fromEntries(
        Object.entries(campaign.channels).filter(([_, value]) => value.template.trim())
      ),
    };

    try {
      if (isEditing) {
        await CampaignService.update(id as string, cleanCampaign);
        toast.success("Campanha atualizada com sucesso!");
      } else {
        await CampaignService.create(cleanCampaign);
        toast.success("Campanha criada com sucesso!");
      }
      router.push("/campaigns");
    } catch (error) {
      console.error("Erro ao salvar campanha", error);
      setError("Erro ao salvar campanha. Tente novamente.");
    }
  };

  if (loading || !user || !campaign) return <Spinner />;
  if (!user || !campaign) return null;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6 sm:mb-4">
        {isEditing ? "Editando Campanha" : "Nova Campanha"}
      </h1>

      <LayoutForm onSave={handleSubmit}>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <div>
            <label className="block mt-3 sm:mt-4">Nome:</label>
            <Input
              name="name"
              value={campaign.name}
              onChange={handleChange}
              placeholder="Nome da Campanha *"
            />
          </div>
          <div>
            <label className="block mt-3 sm:mt-4">Descrição:</label>
            <Textarea
              name="description"
              value={campaign.description || ""}
              onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
              placeholder="Descrição"
              className="min-h-[80px]"
            />
          </div>
        </div>

        <label className="block mt-3 sm:mt-4">Template Email:</label>
        <Select
          value={campaign.channels.email.template}
          onValueChange={(value) =>
            setCampaign((prev) => ({
              ...prev!,
              channels: { ...prev!.channels, email: { ...prev!.channels.email, template: value } },
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecionar Template de Email" />
          </SelectTrigger>
          <SelectContent>
            {emailTemplates.length > 0 ? (
              emailTemplates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Nenhum template disponível
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <label className="block mt-3 sm:mt-4">Template WhatsApp:</label>
        <Select
          value={campaign.channels.whatsapp?.template}
          onValueChange={(value) =>
            setCampaign((prev) => ({
              ...prev!,
              channels: {
                ...prev!.channels,
                whatsapp: { ...prev!.channels.whatsapp, template: value },
              },
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecionar Template de WhatsApp" />
          </SelectTrigger>
          <SelectContent>
            {whatsappTemplates?.length > 0 ? (
              whatsappTemplates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Nenhum template disponível
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        {/* Tags */}
        <label className="block mt-3 sm:mt-4">Tags:</label>
        <Input
          placeholder="Adicione uma tag"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const input = e.currentTarget;
              handleTagsChange(input.value, () => (input.value = ""));
            }
          }}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {campaign.filters?.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center space-x-2 px-2 py-1 text-xs font-semibold shadow-md transition bg-teal-700 border-teal-800 text-white hover:bg-teal-800 hover:border-teal-900"
            >
              {tag}
              <button
                className="ml-1 text-white hover:text-gray-100 focus:outline-none"
                onClick={() => handleTagRemove(tag)}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </LayoutForm>
    </div>
  );
};

EditCampaignPage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default EditCampaignPage;
