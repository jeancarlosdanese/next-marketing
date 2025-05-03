// File: pages/campaigns/manage/[id].tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Campaign } from "@/types/campaign";
import { CampaignService } from "@/services/campaign";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";
import { CampaignData, CampaignSettings, CampaignAudience } from "@/components/Campaign";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { statusIcons } from "@/constants/statusIcons";
import { Clock } from "lucide-react";
import { CampaignMessagesAI } from "@/components/Campaign/CampaignMessagesAI";

const ManageCampaignPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(false);
  const [activeTab, setActiveTab] = useState("dados");

  useEffect(() => {
    if (!id) return;
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const data = await CampaignService.getById(id as string);
      setCampaign(data);
    } catch (error) {
      console.error("Erro ao carregar campanha", error);
      toast.error("Erro ao carregar campanha.");
      router.push("/campaigns");
    } finally {
      setLoading(false);
    }
  };

  async function activateCampaign() {
    if (!campaign) return;
    setIsActivating(true);
    try {
      await CampaignService.updateStatus(id as string, { status: "processando" });
      toast.success("Campanha ativada com sucesso!");
      fetchCampaign();
    } catch (error) {
      console.error("Erro ao ativar campanha", error);
      toast.error("Erro ao ativar a campanha.");
    }
    setIsActivating(false);
  }

  if (loading) return <Spinner />;
  if (!campaign) return <p className="text-center text-gray-500">Campanha não encontrada.</p>;

  const status = statusIcons[campaign.status as keyof typeof statusIcons] || {
    icon: <Clock className="w-4 h-4 text-gray-600" />,
    label: "Desconhecido",
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Gerenciar Campanha</h1>
          {/* 🔹 Botão de Ativação/Reativação */}
          {["pendente", "cancelada"].includes(campaign.status) && (
            <Button variant="default" onClick={activateCampaign} disabled={isActivating}>
              {isActivating ? "⏳ Processando..." : "🚀 Ativar Campanha"}
            </Button>
          )}
        </div>
        {/* Status da campanha */}
        <div className="flex items-center gap-1 text-gray-700 mb-4">
          <div className="flex items-center gap-1 text-gray-700 ml-auto pr-4">
            {status.icon}
            <span className="text-xs font-semibold">{status.label}</span>
          </div>
        </div>
        {/* 🔹 Tabs para alternar entre "Dados", "Configuração" e "Audiência" */}
        <Tabs defaultValue="dados" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dados">📝 Dados</TabsTrigger>
            <TabsTrigger value="configuracao">⚙️ Configuração</TabsTrigger>
            <TabsTrigger value="audiencia">🎯 Audiência</TabsTrigger>
            <TabsTrigger value="mensagens">✨ Mensagens com IA</TabsTrigger>
          </TabsList>

          <TabsContent value="dados">
            <CampaignData campaign={campaign} />
          </TabsContent>

          <TabsContent value="configuracao">
            <CampaignSettings campaignId={campaign.id} status={campaign.status} />
          </TabsContent>

          <TabsContent value="audiencia">
            <CampaignAudience campaignId={campaign.id} status={campaign.status} />
          </TabsContent>

          <TabsContent value="mensagens">
            <CampaignMessagesAI campaignId={campaign.id} />
          </TabsContent>
        </Tabs>
        <div className="flex justify-end">
          <Button variant="default" onClick={() => router.push("/campaigns")}>
            Voltar
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ManageCampaignPage;
