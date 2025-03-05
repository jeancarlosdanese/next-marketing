// File: pages/campaigns/[id]/audience.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
import { CampaignService } from "@/services/campaign";
import { Contact } from "@/types/contact";
import { Paginator as PaginatorType } from "@/types/paginator";
import Paginator from "@/components/Paginator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/Spinner";
import { CheckSquare, PlusCircle, Square, Trash2, UserCheck, UserPlus } from "lucide-react";
import { Audience } from "@/types/audience";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function CampaignAudiencePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { id: campaignId } = router.query;

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    whatsapp: "",
    gender: "",
    birth_date_start: "",
    birth_date_end: "",
    bairro: "",
    cidade: "",
    estado: "",
    tags: "",
  });
  const [availablesPage, setAvailablePage] = useState<Omit<PaginatorType<Contact>, "data">>({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    per_page: 12,
  });
  const [audiencePage, setAudiencePage] = useState<Omit<PaginatorType<Audience>, "data">>({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    per_page: 12,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user || !campaignId) return;
    fetchContacts();
    fetchAudience();
  }, [user, loading, campaignId, filters, availablesPage.current_page, audiencePage.current_page]);

  async function fetchContacts() {
    try {
      const response = await CampaignService.getAvailableContacts(
        campaignId as string,
        filters,
        availablesPage.current_page,
        availablesPage.per_page
      );
      setContacts(response.data);
      setAvailablePage({
        total_records: response.total_records,
        total_pages: response.total_pages,
        current_page: response.current_page,
        per_page: response.per_page,
      });
    } catch (error) {
      toast.error("Erro ao carregar contatos disponíveis.");
    }
  }

  async function fetchAudience() {
    try {
      const response = await CampaignService.getAudienceContacts(
        campaignId as string,
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts?.map((c) => c.id).filter(Boolean) as string[]);
    }
    setSelectAll(!selectAll);
  };

  const addContactsToAudience = async () => {
    if (selectedContacts.length === 0) return;

    try {
      await CampaignService.addContactsToAudience(campaignId as string, selectedContacts);
      fetchContacts();
      fetchAudience();
      setSelectedContacts([]);
      setSelectAll(false);
      toast.success("Contatos adicionados com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar contatos à audiência.");
    }
  };

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) => value !== undefined && value !== "" && value !== "none"
    )
  );

  const addAllContactsToAudience = async () => {
    if (contacts.length === 0) return;

    const filtersToAdd = {
      filters: cleanFilters,
      current_page: availablesPage.current_page,
      per_page: availablesPage.per_page,
    };

    try {
      const response = await CampaignService.addAllFilteredContactsToAudience(
        campaignId as string,
        filtersToAdd
      );
      fetchContacts();

      // Atualiza a audiência com os novos contatos
      setAudiences(response.data);
      setAudiencePage({
        total_records: response.total_records,
        total_pages: response.total_pages,
        current_page: response.current_page,
        per_page: response.per_page,
      });
      toast.success("Todos os contatos foram adicionados com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar contatos à audiência.");
    }
  };

  const removeContactFromAudience = async (contactId: string) => {
    try {
      await CampaignService.removeContactFromAudience(campaignId as string, contactId);
      fetchContacts();
      fetchAudience();
      toast.success("Contato removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover contato da audiência.");
    }
  };

  const removeAllContactsFromAudience = async () => {
    if (audiences?.length === 0) return;

    try {
      await CampaignService.removeAllAudience(campaignId as string);
      fetchContacts();
      fetchAudience();
      toast.success("Todos os contatos foram removidos com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover contatos da audiência.");
    }
  };

  if (loading) return <Spinner />;
  if (!user) return null;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Audiência da Campanha</h1>
        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Nome, Email e WhatsApp */}
              <Input
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Nome"
              />
              <Input
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                placeholder="Email"
              />
              <Input
                name="whatsapp"
                value={filters.whatsapp}
                onChange={handleFilterChange}
                placeholder="WhatsApp"
              />

              {/* Filtro de Gênero */}
              <Select
                value={filters.gender}
                onValueChange={(value) =>
                  setFilters({ ...filters, gender: value === "none" ? "" : value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar Gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectItem className="bg-secondary flex justify-center" value="none">
                    <span className="text-xs">Limpar</span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Data de nascimento */}
              <Input
                type="date"
                name="birth_date_start"
                value={filters.birth_date_start}
                onChange={handleFilterChange}
              />
              <Input
                type="date"
                name="birth_date_end"
                value={filters.birth_date_end}
                onChange={handleFilterChange}
              />

              {/* Endereço */}
              <Input
                name="bairro"
                value={filters.bairro}
                onChange={handleFilterChange}
                placeholder="Bairro"
              />
              <Input
                name="cidade"
                value={filters.cidade}
                onChange={handleFilterChange}
                placeholder="Cidade"
              />
              <Input
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                placeholder="Estado"
              />

              {/* Tags */}
              <Input
                name="tags"
                value={filters.tags}
                onChange={(e) => {
                  setFilters({ ...filters, tags: e.target.value });
                }}
                onBlur={() => {
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    tags: prevFilters.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag.length > 0)
                      .join(", "),
                  }));
                }}
                placeholder="Tags (separadas por vírgula)"
              />
            </div>

            {/* Botão Adicionar Todos dentro do painel de Filtros */}
            <div className="flex justify-end mt-4">
              <Button
                onClick={addAllContactsToAudience}
                disabled={!contacts || contacts.length === 0}
                variant="default"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Adicionar Todos os Filtrados
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Contatos Disponíveis */}
        <Card className="mb-6 bg-contacts-available">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck size={20} className="text-primary" /> Contatos Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contacts?.length > 0 ? (
              <>
                {/* Botões dentro do painel */}
                <div className="flex justify-between mb-4">
                  <Button onClick={handleSelectAll} variant="default">
                    {selectAll ? (
                      <>
                        <CheckSquare className="w-5 h-5 mr-2" />
                        Desmarcar Todos
                      </>
                    ) : (
                      <>
                        <Square className="w-5 h-5 mr-2" />
                        Selecionar Todos
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={addContactsToAudience}
                    disabled={selectedContacts.length === 0}
                    variant="default"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Adicionar Selecionados
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center bg-muted p-4 rounded-lg shadow-md"
                    >
                      <Checkbox
                        checked={contact.id ? selectedContacts.includes(contact.id) : false}
                        onCheckedChange={() => contact.id && handleSelectContact(contact.id)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium">{contact.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Nenhum contato disponível para adicionar.
              </p>
            )}
          </CardContent>

          {/* Paginação dos Contatos Disponíveis */}
          {contacts?.length > 0 && (
            <div className="p-4">
              <Paginator
                totalRecords={availablesPage.total_records}
                totalPages={availablesPage.total_pages}
                currentPage={availablesPage.current_page}
                perPage={availablesPage.per_page}
                onPageChange={(newPage) =>
                  setAvailablePage((prev) => ({ ...prev, current_page: newPage }))
                }
              />
            </div>
          )}
        </Card>

        {/* Contatos Adicionados */}
        <Card className="mb-6 bg-contacts-added">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck size={20} className="text-primary" /> Contatos Adicionados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {audiences?.length > 0 ? (
              <>
                {/* Botão Remover Todos dentro do painel */}
                <div className="flex justify-end mb-4">
                  <Button onClick={removeAllContactsFromAudience} variant="destructive">
                    <Trash2 className="w-5 h-5 mr-2" />
                    Remover Todos
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {audiences.map((audience) => (
                    <div
                      key={audience.id}
                      className="flex justify-between items-center bg-muted p-4 rounded-lg shadow-md"
                    >
                      <span className="text-sm font-medium">{audience.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => audience.id && removeContactFromAudience(audience.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Nenhum contato adicionado à campanha ainda.
              </p>
            )}
          </CardContent>

          {/* Paginação dos Contatos Adicionados */}
          {audiences?.length > 0 && (
            <div className="p-4">
              <Paginator
                totalRecords={audiencePage.total_records}
                totalPages={audiencePage.total_pages}
                currentPage={audiencePage.current_page}
                perPage={audiencePage.per_page}
                onPageChange={(newPage) =>
                  setAudiencePage((prev) => ({ ...prev, current_page: newPage }))
                }
              />
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
