// File: pages/campaigns.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Campaign } from "@/types/campaign";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    axios
      .get<Campaign[]>(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setCampaigns(response.data))
      .catch((error) => console.error("Erro ao carregar campanhas", error));
  }, [router]);

  const deleteCampaign = async (id: string) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Tem certeza que deseja excluir esta campanha?")) {
      return;
    }

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
    } catch (error) {
      console.error("Erro ao excluir campanha", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header user={{ email: "admin@hyberica.io" }} />
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
                  <p className="text-sm text-gray-600">{campaign.status}</p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/campaigns/edit?id=${campaign.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/campaigns/${campaign.id}`)}
                    >
                      Ver detalhes
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
