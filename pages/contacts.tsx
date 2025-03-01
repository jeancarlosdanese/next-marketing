// File: pages/contacts.tsx

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ContactService } from "@/services/contact";
import { Contact } from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Paginator as PaginatorType } from "@/types/paginator"; // 🔹 Renomeia o tipo
import Paginator from "@/components/Paginator"; // 🔹 Mantém o nome do componente
import { format } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import Spinner from "@/components/Spinner";

export default function ContactsPage() {
  const { user, loading } = useUser();
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
  const [pagination, setPagination] = useState<Omit<PaginatorType<Contact>, "data">>({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    per_page: 10,
  });
  const router = useRouter();

  // 🔹 Redirecionamento seguro dentro do useEffect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;

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
  }, [loading, user, filters, pagination.current_page]);

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

  if (loading) return <Spinner />; // 🔹 Agora o spinner está fora do retorno condicional do React
  if (!user) return null; // 🔹 Evita exibição de conteúdo antes do redirecionamento

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header user={user} />
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
        <Paginator
          totalRecords={pagination.total_records}
          totalPages={pagination.total_pages}
          currentPage={pagination.current_page}
          perPage={pagination.per_page}
          onPageChange={(newPage) => setPagination((prev) => ({ ...prev, current_page: newPage }))}
        />
      </div>
    </div>
  );
}
