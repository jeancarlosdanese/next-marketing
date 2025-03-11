// File: pages/campaigns.tsx

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from "@/types/campaign";
import { CampaignService } from "@/services/campaign";
import Spinner from "@/components/Spinner";
import Layout from "@/components/Layout";
import { CheckCircle, Clock, ListChecks, XCircle, Play, RefreshCw, Search } from "lucide-react";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectSeparator,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// 🔹 Ícones e rótulos para os novos status da campanha
const statusIcons = {
  pendente: { icon: <Clock className="w-4 h-4 text-yellow-600" />, label: "Pendente" },
  configurada: { icon: <ListChecks className="w-4 h-4 text-blue-500" />, label: "Configurada" },
  com_audiencia: { icon: <Play className="w-4 h-4 text-purple-500" />, label: "Com Audiência" },
  processando: {
    icon: <RefreshCw className="w-4 h-4 text-orange-500 animate-spin" />,
    label: "Processando",
  },
  ativa: { icon: <CheckCircle className="w-4 h-4 text-green-600" />, label: "Ativa" },
  concluida: { icon: <XCircle className="w-4 h-4 text-gray-500" />, label: "Concluída" },
};

const CampaignsPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filters, setFilters] = useState<{ status?: string; name?: string }>({});
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      fetchCampaigns();
    }
  }, [loading, user, filters]); // 🔹 Atualiza quando filtros mudam

  // 🔹 Função para buscar campanhas aplicando os filtros corretamente
  const fetchCampaigns = async () => {
    try {
      const data = await CampaignService.getAll(filters);
      setCampaigns(data);
    } catch (error) {
      console.error("Erro ao carregar campanhas", error);
      toast.error("Erro ao carregar campanhas.");
    }
  };

  // 🔹 Atualiza os filtros dinamicamente
  const updateFilter = (key: "status" | "name", value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value, // Remove a chave se o valor for undefined
    }));
  };

  const deleteCampaign = async (id: string) => {
    setIsDeleting(true);
    try {
      await CampaignService.delete(id);
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
      toast.success("Campanha excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir campanha", error);
      toast.error("Erro ao excluir campanha. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!user) return null;

  return (
    <div className="p-6">
      {/* 🔹 Cabeçalho e Filtros */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Campanhas</h1>
        <div className="flex flex-col sm:flex-row gap-3"></div>
        <Button className="w-full sm:w-auto" onClick={() => router.push("/campaigns/new")}>
          ➕ Nova Campanha
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Filtro de Status */}
        <Select
          value={filters.status || ""}
          onValueChange={(value) => updateFilter("status", value === "none" ? undefined : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecionar Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="configurada">Configurada</SelectItem>
              <SelectItem value="com_audiencia">Com Audiência</SelectItem>
              <SelectItem value="ativa">Ativa</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectItem className="bg-secondary flex justify-center" value="none">
              <span className="text-xs">Limpar</span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro de Nome */}
        <Input
          className="w-full"
          placeholder="Buscar por nome..."
          onChange={(e) => updateFilter("name", e.target.value)}
        />
      </div>

      {/* 🔹 Lista de campanhas */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns?.length > 0 ? (
          campaigns?.map((campaign) => {
            const status = statusIcons[campaign.status as keyof typeof statusIcons] || {
              icon: <Clock className="w-4 h-4 text-gray-600" />,
              label: "Desconhecido",
            };

            return (
              <Card key={campaign.id} className="flex flex-col justify-between shadow-lg">
                <CardHeader className="flex justify-between items-start">
                  <CardTitle>{campaign.name}</CardTitle>
                  <div className="flex items-center gap-1 text-gray-700 ml-auto">
                    {status.icon}
                    <span className="text-xs">{status.label}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/campaigns/${campaign.id}`)}
                    >
                      Ver detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/campaigns/edit?id=${campaign.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => router.push(`/campaigns/${campaign.id}/audience`)}
                    >
                      🎯 Audiência
                    </Button>
                    {campaign.status === "pendente" && (
                      <ConfirmDelete
                        onConfirm={() => deleteCampaign(campaign.id)}
                        entityName="Campanha"
                        disabled={isDeleting}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="text-gray-500">Nenhuma campanha encontrada.</p>
        )}
      </div>
    </div>
  );
};

// Define o Layout global para a página
CampaignsPage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default CampaignsPage;
