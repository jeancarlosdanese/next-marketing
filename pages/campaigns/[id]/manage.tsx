// File: pages/campaigns/[id]/manage.tsx

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
import { Container } from "@/components/ui/Container";

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
    <Container>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciar Campanha</h1>
        {/* 🔹 Botão de Voltar */}
        <div className="flex flex-col justify-end mt-6 gap-2">
          <Button variant="default" onClick={() => router.push("/campaigns")}>
            Voltar
          </Button>
          {/* 🔹 Botão de Ativação/Reativação */}
          {["pendente", "cancelada"].includes(campaign.status) && (
            <Button variant="default" onClick={activateCampaign} disabled={isActivating}>
              {isActivating ? "⏳ Processando..." : "🚀 Ativar Campanha"}
            </Button>
          )}
        </div>
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
        {/* 🔹 Lista de Tabs */}
        <TabsList className="w-full flex flex-wrap justify-between gap-2 mb-4 h-auto">
          <TabsTrigger value="dados" className="flex-1 min-w-[120px] border-b-2 border-gray-500">
            📝 Dados
          </TabsTrigger>
          <TabsTrigger
            value="configuracao"
            className="flex-1 min-w-[120px] border-b-2 border-gray-500"
          >
            ⚙️ Configuração
          </TabsTrigger>
          <TabsTrigger
            value="audiencia"
            className="flex-1 min-w-[120px] border-b-2 border-gray-500"
          >
            🎯 Audiência
          </TabsTrigger>
          <TabsTrigger
            value="mensagens"
            className="flex-1 min-w-[120px] border-b-2 border-gray-500"
          >
            ✨ Mensagens IA
          </TabsTrigger>
        </TabsList>

        {/* 🔹 Conteúdo das Tabs */}
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
    </Container>
  );
};

// Define o Layout global para a página
ManageCampaignPage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default ManageCampaignPage;
