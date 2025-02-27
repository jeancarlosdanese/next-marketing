// File: pages/campaigns/[id].tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CampaignService } from "@/services/campaign";
import { Campaign } from "@/types/campaign";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CampaignDetailsPage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
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
  }, [id, router]);

  if (!campaign) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

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
