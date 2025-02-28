// File: pages/campaigns/[id].tsx

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CampaignService } from "@/services/campaign";
import { Campaign } from "@/types/campaign";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

export default function CampaignDetailsPage() {
  const { user, loading } = useUser();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const router = useRouter();
  const { id } = router.query;

  // 🔹 Redirecionamento seguro dentro do useEffect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;
    async function fetchCampaign() {
      try {
        if (id) {
          const data = await CampaignService.getById(id as string);
          setCampaign(data);
        }
      } catch (error) {
        console.error("Erro ao carregar campanha", error);
        router.push("/campaigns");
      }
    }

    fetchCampaign();
  }, [loading, user, id, router]);

  if (loading) return <Spinner />; // 🔹 Agora o spinner está fora do retorno condicional do React
  if (!user) return null; // 🔹 Evita exibição de conteúdo antes do redirecionamento
  if (!campaign) return null; // 🔹 Evita exibição de conteúdo antes do carregamento

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{campaign.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Descrição:</strong> {campaign.description || "Sem descrição"}
          </p>
          <p>
            <strong>Status:</strong> {campaign.status}
          </p>
          <p>
            <strong>Tags:</strong>{" "}
            {campaign.filters?.tags?.length ? campaign.filters.tags.join(", ") : "Nenhuma"}
          </p>
          <p>
            <strong>Gênero:</strong> {campaign.filters?.gender || "Todos"}
          </p>
          <p>
            <strong>Data de Nascimento:</strong> {campaign.filters?.birth_date_range?.start} -{" "}
            {campaign.filters?.birth_date_range?.end}
          </p>

          <div className="mt-6 flex gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/campaigns/edit?id=${campaign.id}`)}
            >
              Editar
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/campaigns")}>
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
