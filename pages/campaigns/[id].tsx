// File: pages/campaigns/[id].tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Campaign } from "@/types/campaign";
import { CampaignService } from "@/services/campaign";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Audience } from "@/types/audience";
import { Paginator as PaginatorType } from "@/types/paginator";
import { Mail, MessageSquare, XCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { audienceStatusIcons } from "@/constants/audienceStatusIcons";

const CampaignDetailsPage = () => {
  const { user, loading } = useUser();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [audiencePage, setAudiencePage] = useState<Omit<PaginatorType<Audience>, "data">>({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    per_page: 10, // Definindo um limite para melhor UX
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && !user) return;
    if (!id) return;
    fetchData();
  }, [loading, user, id, router]);

  useEffect(() => {
    if (!id) return;
    fetchAudience();
  }, [id, audiencePage.current_page]);

  async function fetchData() {
    try {
      const data = await CampaignService.getById(id as string);
      setCampaign(data);
    } catch (error) {
      console.error("Erro ao carregar campanha", error);
      toast.error("Erro ao carregar a campanha.");
      router.push("/campaigns");
    }
  }

  async function fetchAudience() {
    try {
      const response = await CampaignService.getAudienceContacts(
        id as string,
        audiencePage.current_page,
        audiencePage.per_page
      );
      setAudiences(response.data);
      setAudiencePage({
        total_records: response.total_records,
        total_pages: response.total_pages,
        current_page: response.current_page,
        per_page: response.per_page,
      });
    } catch (error) {
      toast.error("Erro ao carregar contatos da audiência.");
    }
  }

  async function activateCampaign() {
    if (!campaign) return;
    setIsActivating(true);
    try {
      await CampaignService.updateStatus(id as string, { status: "processando" });
      toast.success("Campanha ativada com sucesso!");
      fetchData(); // Atualiza o status da campanha na UI
    } catch (error) {
      console.error("Erro ao ativar campanha", error);
      toast.error("Erro ao ativar a campanha.");
    }
    setIsActivating(false);
  }

  if (loading || !user || !campaign) return <Spinner />;
  if (!campaign) return null;

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Detalhes da Campanha</h1>

          {/* Botão de Ativação */}
          {campaign.status !== "processando" && (
            <Button
              onClick={activateCampaign}
              disabled={isActivating}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              {isActivating ? "Ativando..." : "Ativar Campanha"}
            </Button>
          )}
        </div>

        {/* Informações da Campanha */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Nome:</strong> {campaign.name}
            </p>
            <p>
              <strong>Descrição:</strong> {campaign.description || "Nenhuma descrição"}
            </p>
            <p>
              <strong>Status:</strong> {campaign.status}
            </p>
          </CardContent>
        </Card>

        {/* Audiência */}
        <Card>
          <CardHeader>
            <CardTitle>Audiência</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Total de contatos:</strong> {audiencePage.total_records}
            </p>

            {/* Tabela de Contatos */}
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border rounded-lg overflow-hidden shadow-md">
                <thead className="bg-gray-100">
                  <tr className="text-left text-gray-700 uppercase text-sm font-medium">
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Canal</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">WhatsApp</th>
                  </tr>
                </thead>
                <tbody>
                  {audiences?.length > 0 ? (
                    audiences?.map((contact) => (
                      <tr key={contact.id} className="border-b text-gray-900">
                        <td className="px-4 py-3">{contact.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {contact.type === "email" ? (
                              <>
                                <Mail className="w-5 h-5 text-blue-500" /> Email
                              </>
                            ) : (
                              <>
                                <MessageSquare className="w-5 h-5 text-green-500" /> WhatsApp
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {audienceStatusIcons[
                              contact.status as keyof typeof audienceStatusIcons
                            ] ? (
                              <>
                                {
                                  audienceStatusIcons[
                                    contact.status as keyof typeof audienceStatusIcons
                                  ].icon
                                }
                                <span>
                                  {
                                    audienceStatusIcons[
                                      contact.status as keyof typeof audienceStatusIcons
                                    ].label
                                  }
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-gray-600" />{" "}
                                <span>{contact.status}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">{contact.email || "—"}</td>
                        <td className="px-4 py-3">{contact.whatsapp || "—"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-500">
                        Nenhum contato adicionado à campanha.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CampaignDetailsPage;
