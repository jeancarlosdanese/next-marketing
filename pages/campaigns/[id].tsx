// File: pages/campaigns/[id].tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Campaign } from "@/types/campaign";
import { CampaignService } from "@/services/campaign";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";
import { CheckCircle, Clock, XCircle } from "lucide-react";

const statusIcons = {
  ativa: { icon: <CheckCircle className="w-4 h-4 text-green-600" />, label: "Ativa" },
  pendente: { icon: <Clock className="w-4 h-4 text-yellow-600" />, label: "Pendente" },
  encerrada: { icon: <XCircle className="w-4 h-4 text-red-600" />, label: "Encerrada" },
};

const CampaignDetailPage = () => {
  const { user, loading } = useUser();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && !user) return;
    if (!id) return;

    async function fetchCampaign() {
      try {
        const data = await CampaignService.getById(id as string);
        setCampaign(data);
      } catch (error) {
        console.error("Erro ao carregar campanha", error);
        setError("Erro ao carregar campanha.");
      }
    }

    fetchCampaign();
  }, [loading, user, id]);

  const deleteCampaign = async () => {
    setIsDeleting(true);
    try {
      await CampaignService.delete(id as string);
      toast.success("Campanha excluída com sucesso!");
      router.push("/campaigns");
    } catch (error) {
      console.error("Erro ao excluir campanha", error);
      toast.error("Erro ao excluir campanha. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading || !user || !campaign) return <Spinner />;
  if (!campaign) return null;

  const status = statusIcons[campaign.status as keyof typeof statusIcons] || {
    icon: <Clock className="w-4 h-4 text-gray-600" />,
    label: "Desconhecido",
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalhes da Campanha</h1>
        <Button variant="default" onClick={() => router.push(`/campaigns/edit?id=${campaign.id}`)}>
          Editar Campanha
        </Button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>{campaign.name}</CardTitle>
          <div className="flex items-center gap-2 text-gray-700">
            {status.icon}
            <span className="text-sm">{status.label}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{campaign.description || "Sem descrição"}</p>

          <div className="mt-4">
            <h3 className="font-semibold">Templates Utilizados:</h3>
            <ul className="text-gray-700">
              <li>
                📧 <strong>Email:</strong> {campaign.channels.email?.template || "Nenhum"}
              </li>
              <li>
                💬 <strong>WhatsApp:</strong> {campaign.channels.whatsapp?.template || "Nenhum"}
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Filtros Aplicados:</h3>
            <ul className="text-gray-700">
              <li>👥 Gênero: {campaign.filters.gender || "Todos"}</li>
              <li>
                🎂 Data de Nascimento:{" "}
                {campaign.filters.birth_date_range?.start
                  ? `${campaign.filters.birth_date_range.start} até ${campaign.filters.birth_date_range.end}`
                  : "Sem filtro"}
              </li>
              <li>
                🏷️ Tags:
                {campaign.filters.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {campaign.filters.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  " Nenhuma"
                )}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button variant="outline" onClick={() => router.push("/campaigns")}>
          Voltar
        </Button>
      </div>
    </div>
  );
};

// Define o Layout global para a página
CampaignDetailPage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default CampaignDetailPage;
