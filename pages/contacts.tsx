// File: pages/contacts.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ContactService } from "@/services/contact";
import { Contact } from "@/types/contact";
import { Paginator } from "@/types/paginator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { format } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAllTags, setShowAllTags] = useState<{ [key: string]: boolean }>({});
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
    interesses: "",
    perfil: "",
    eventos: "",
  });
  const [pagination, setPagination] = useState<Omit<Paginator<Contact>, "data">>({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    per_page: 10,
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await ContactService.getPaginated(
          filters,
          pagination.current_page,
          pagination.per_page,
          "updated_at DESC"
        );
        setContacts(response.data);
        setPagination({
          total_records: response.total_records,
          total_pages: response.total_pages,
          current_page: response.current_page,
          per_page: response.per_page,
        });
      } catch (error) {
        console.error("Erro ao carregar contatos", error);
      }
    }

    fetchContacts();
  }, [filters, pagination.current_page]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Função para formatar telefone
  const formatPhone = (phone: string | undefined) => {
    if (!phone) return "Não informado";

    // Remover espaços e caracteres extras
    const cleaned = phone.replace(/\D/g, "");

    // Caso tenha DDI (Ex: +55)
    if (cleaned.length === 13) {
      return cleaned.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, "+$1 ($2) $3-$4");
    }

    // Caso sem DDI (Ex: (49) 98813-4462)
    if (cleaned.length === 11) {
      return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    }

    return phone; // Caso não seja compatível com os formatos esperados
  };

  // Função para formatar data
  const formatDate = (date: string | undefined) => {
    if (!date) return "Não informado";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  // Função para formatar tags com limite
  const formatTags = (
    tags: { interesses?: string[]; perfil?: string[]; eventos?: string[] } | undefined,
    maxTags: number = 3
  ) => {
    if (!tags || Object.keys(tags).length === 0) return "Nenhuma tag cadastrada";

    const extractTags = (tagArray?: string[]) =>
      Array.isArray(tagArray) ? tagArray.filter(Boolean) : [];

    const allTags = [
      ...extractTags(tags.interesses),
      ...extractTags(tags.perfil),
      ...extractTags(tags.eventos),
    ];

    return allTags.length > maxTags
      ? allTags.slice(0, maxTags).join(", ") + "..."
      : allTags.join(", ");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header user={{ email: "admin@hyberica.io" }} />
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Contatos</h1>
          <Button onClick={() => router.push("/contacts/new")}>Novo Contato</Button>
        </div>

        {/* Lista de Contatos */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {contacts?.length > 0 ? (
            contacts.map((contact) => {
              const allTags = [
                ...(contact.tags?.interesses || []),
                ...(contact.tags?.perfil || []),
                ...(contact.tags?.eventos || []),
              ];

              return (
                <Card key={contact.id} className="shadow-lg">
                  <CardHeader>
                    <CardTitle>{contact.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Divisão do card em 2 colunas */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Primeira coluna */}
                      <div>
                        <p className="text-sm text-blue-600 font-semibold">
                          📧 {contact.email || "Não informado"}
                        </p>
                        <p className="text-sm text-gray-600">📱 {formatPhone(contact.whatsapp)}</p>
                        <p className="text-sm text-gray-600">
                          📍{" "}
                          {contact.cidade
                            ? `${contact.cidade}, ${contact.estado || ""}`
                            : "Não informado"}
                        </p>
                        <p className="text-sm text-gray-600">
                          🎂 Nascimento: {formatDate(contact.birth_date)}
                        </p>
                      </div>

                      {/* Segunda coluna */}
                      <div>
                        <p className="text-sm text-gray-600">
                          🏷️ Tags:
                          <span className="block mt-1 bg-gray-100 p-2 rounded-md text-xs text-gray-800 break-words">
                            {contact.id && showAllTags[contact.id]
                              ? allTags.join(", ")
                              : formatTags(contact.tags, 3)}
                          </span>
                        </p>
                        {allTags.length > 3 && (
                          <button
                            onClick={() =>
                              setShowAllTags((prev) => ({
                                ...prev,
                                [String(contact.id)]: !prev[String(contact.id)],
                              }))
                            }
                            className="text-xs text-blue-600 hover:underline mt-1"
                          >
                            {contact.id && showAllTags[contact.id]
                              ? "Mostrar menos"
                              : "Mostrar mais"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push(`/contacts/edit?id=${contact.id}`)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => ContactService.delete(contact.id as string)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-gray-500 text-center col-span-full">Nenhum contato encontrado.</p>
          )}
        </div>

        {/* Paginação */}
        <div className="flex flex-col items-center mt-6">
          <p className="text-sm text-gray-600">
            Exibindo{" "}
            <span className="font-semibold">
              {pagination.total_records === 0
                ? 0
                : (pagination.current_page - 1) * pagination.per_page + 1}
            </span>
            {" - "}
            <span className="font-semibold">
              {Math.min(pagination.current_page * pagination.per_page, pagination.total_records)}
            </span>
            {" de "}
            <span className="font-semibold">{pagination.total_records}</span> registros
          </p>

          <div className="flex justify-center gap-4 mt-2">
            <Button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  current_page: Math.max(prev.current_page - 1, 1),
                }))
              }
              disabled={pagination.current_page === 1}
            >
              Anterior
            </Button>
            <span className="mx-4 mt-2 text-sm font-semibold text-gray-600 mb-4 align-middle">
              Página {pagination.current_page} de {pagination.total_pages}
            </span>
            <Button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  current_page: Math.min(prev.current_page + 1, pagination.total_pages),
                }))
              }
              disabled={pagination.current_page >= pagination.total_pages}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
