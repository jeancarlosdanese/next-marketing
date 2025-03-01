// File: pages/campaigns/[id]/audience.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
import { CampaignService } from "@/services/campaign";
import { Contact } from "@/types/contact";
import { Paginator as PaginatorType } from "@/types/paginator";
import Paginator from "@/components/Paginator";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/Spinner";
import { Trash2 } from "lucide-react"; // 🔹 Importando ícone de lixeira
import { Audience } from "@/types/audience";
import { UserCheck } from "lucide-react";
import { toast } from "sonner";

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
    per_page: 20,
  });
  const [audiencePage, setAudiencePage] = useState<Omit<PaginatorType<Audience>, "data">>({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    per_page: 20,
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
      setSelectedContacts(contacts.map((c) => c.id).filter(Boolean) as string[]);
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
    Object.entries(filters).filter(([_, value]) => value !== "" && value !== undefined)
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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header user={user} />
        <h1 className="text-2xl font-bold mb-6">Audiência da Campanha</h1>

        {/* Filtros */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 p-4 bg-white shadow rounded-lg">
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

          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Gênero</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>

          <Input
            type="date"
            name="birth_date_start"
            value={filters.birth_date_start}
            onChange={handleFilterChange}
            placeholder="Nascimento Início"
          />
          <Input
            type="date"
            name="birth_date_end"
            value={filters.birth_date_end}
            onChange={handleFilterChange}
            placeholder="Nascimento Fim"
          />

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
          <Input
            name="tags"
            value={filters.tags}
            onChange={handleFilterChange}
            placeholder="Tags"
          />
        </div>

        {/* Botões de ação */}
        <div className="flex gap-4 mb-6">
          <Button onClick={handleSelectAll}>
            {selectAll ? "Desmarcar Todos" : "Selecionar Todos"}
          </Button>
          <Button onClick={addContactsToAudience} disabled={selectedContacts.length === 0}>
            Adicionar Selecionados
          </Button>
          <Button onClick={addAllContactsToAudience} disabled={!contacts || contacts.length === 0}>
            Adicionar Todos
          </Button>
          <Button
            onClick={removeAllContactsFromAudience}
            disabled={!audiences || audiences?.length === 0}
            variant="destructive"
          >
            Remover Todos
          </Button>
        </div>

        {/* Lista de Contatos Disponíveis */}
        <div className="flex items-center justify-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-stone-700 text-sm flex items-center">
            <UserCheck size={18} className="mr-2 text-stone-700" /> Contatos Disponíveis
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {!contacts || contacts?.length === 0 ? (
          <p className="text-gray-500 text-center p-4 bg-white shadow rounded-lg">
            Nenhum contato disponível para adicionar.
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-stone-200 p-4 rounded-lg">
            {contacts?.map((contact) => (
              <div
                key={contact.id}
                className="bg-white p-4 shadow rounded-lg flex justify-between items-center bg-stone-100"
              >
                <input
                  type="checkbox"
                  checked={contact.id ? selectedContacts.includes(contact.id) : false}
                  onChange={() => contact.id && handleSelectContact(contact.id)}
                  className="mr-2"
                />
                <span className="text-sm font-semibold">{contact.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Paginação dos Contatos Disponíveis (Ocultar se não houver registros) */}
        {contacts?.length > 0 && (
          <Paginator
            totalRecords={availablesPage.total_records}
            totalPages={availablesPage.total_pages}
            currentPage={availablesPage.current_page}
            perPage={availablesPage.per_page}
            onPageChange={(newPage) =>
              setAvailablePage((prev) => ({ ...prev, current_page: newPage }))
            }
          />
        )}

        {/* Lista de Contatos na Audiência */}
        <div className="flex items-center justify-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-stone-700 text-sm flex items-center">
            <UserCheck size={18} className="mr-2 text-stone-700" /> Contatos Adicionados
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {!audiences || audiences?.length === 0 ? (
          <p className="text-gray-500 text-center p-4 bg-white shadow rounded-lg">
            Nenhum contato adicionado à campanha ainda.
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-neutral-200 p-4 rounded-lg">
            {audiences?.map((audience) => (
              <div
                key={audience.id}
                className="bg-white p-4 shadow rounded-lg flex justify-between items-center bg-neutral-100"
              >
                <span className="text-sm font-semibold">{audience.name}</span>
                <button
                  onClick={() => audience.id && removeContactFromAudience(audience.id)}
                  className="text-red-600 hover:text-red-800 transition duration-200 p-2 rounded-full"
                  title="Remover"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Paginação da Audiência (Ocultar se não houver registros) */}
        {audiences?.length > 0 && (
          <Paginator
            totalRecords={audiencePage.total_records}
            totalPages={audiencePage.total_pages}
            currentPage={audiencePage.current_page}
            perPage={audiencePage.per_page}
            onPageChange={(newPage) =>
              setAudiencePage((prev) => ({ ...prev, current_page: newPage }))
            }
          />
        )}

        {/* Separador */}
        <hr className="my-6" />
      </div>
    </div>
  );
}
