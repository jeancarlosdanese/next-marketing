// File: pages/campaigns.tsx

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Campaign } from "@/types/campaign";
import { CampaignService } from "@/services/campaign";
import Spinner from "@/components/Spinner";

export default function CampaignsPage() {
  const { user, loading } = useUser();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const router = useRouter();

  // 🔹 Redirecionamento seguro dentro do useEffect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;

    async function fetchCampaigns() {
      try {
        const data = await CampaignService.getAll();
        setCampaigns(data);
      } catch (error) {
        console.error("Erro ao carregar campanhas", error);
      }
    }

    fetchCampaigns();
  }, [loading, user]); // 🔹 Agora roda sempre que `user` for definido

  const deleteCampaign = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta campanha?")) return;

    try {
      await CampaignService.delete(id);
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
    } catch (error) {
      console.error("Erro ao excluir campanha", error);
    }
  };

  if (loading) return <Spinner />; // 🔹 Agora o spinner está fora do retorno condicional do React
  if (!user) return null; // 🔹 Evita exibição de conteúdo antes do redirecionamento

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header user={user} />
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Campanhas</h1>
          <Button onClick={() => router.push("/campaigns/new")}>Nova Campanha</Button>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <CardTitle>{campaign.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">{campaign.status}</p>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => router.push(`/campaigns/${campaign.id}/audience`)}
                    >
                      🎯 Gerenciar Audiência
                    </Button>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/campaigns/${campaign.id}`)}
                    >
                      Ver detalhes
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/campaigns/edit?id=${campaign.id}`)}
                    >
                      Editar
                    </Button>
                    {campaign.status === "pendente" && (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => deleteCampaign(campaign.id)}
                      >
                        Excluir
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">Nenhuma campanha encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}
