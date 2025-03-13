// File: pages/contacts.tsx

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ContactService } from "@/services/contact";
import { ContactList } from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paginator as PaginatorType } from "@/types/paginator";
import Paginator from "@/components/Paginator";
import { format } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import Spinner from "@/components/Spinner";
import Layout from "@/components/Layout";
import { Trash, Pencil, UploadCloud, Mars, Venus, NonBinary } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";

const ContactsPage = () => {
  const { user, loading } = useUser();
  const [contacts, setContacts] = useState<ContactList[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatorType<ContactList>, "data">>({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    per_page: 9,
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

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
          {},
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
  }, [loading, user, pagination.current_page]);

  const deleteContact = async (id: string) => {
    setIsDeleting(true);

    try {
      await ContactService.delete(id);
      setContacts((prev) => prev.filter((contato) => contato.id !== id));

      toast.success("Contato excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir contato", error);
      toast.error("Erro ao excluir contato. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPhone = (phone?: string) =>
    phone ? phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3") : "Não informado";

  const formatDate = (date?: string) =>
    date ? format(new Date(date), "dd/MM/yyyy", { locale: ptBR }) : "Não informado";

  if (loading || contacts.length === 0) return <Spinner />;
  if (!user) return null;

  return (
    <div className="p-6">
      {/* Cabeçalho e botões responsivos */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Contatos</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            className="flex gap-2 w-full sm:w-auto"
            onClick={() => router.push("/contacts/import/history")}
          >
            <UploadCloud className="w-4 h-4" />
            Importar Contatos
          </Button>
          <Button
            className="flex gap-2 w-full sm:w-auto"
            onClick={() => router.push("/contacts/new")}
          >
            ➕ Novo Contato
          </Button>
        </div>
      </div>

      {/* Lista de Contatos */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <Card key={contact.id} className="shadow-lg flex flex-col justify-between h-full">
              <CardHeader className="grid grid-cols-[10fr_1fr] justify-between">
                <CardTitle className="flex-1 text-left">{contact.name}</CardTitle>
                {contact.gender && (
                  <div className="flex items-center space-x-1">
                    {contact.gender === "masculino" && <Mars className="w-4 h-4 text-blue-500" />}
                    {contact.gender === "feminino" && <Venus className="w-4 h-4 text-pink-500" />}
                    {contact.gender === "outro" && <NonBinary className="w-4 h-4 text-gray-500" />}
                  </div>
                )}
              </CardHeader>

              <CardContent className="flex-1">
                <div className="grid grid-cols-2 gap-2">
                  {contact.email && (
                    <p
                      className="text-sm text-blue-600 font-semibold truncate"
                      title={contact.email}
                    >
                      📧 {contact.email}
                    </p>
                  )}
                  {contact.birth_date && (
                    <p className="text-sm text-gray-600">
                      🎂 Nascimento: {formatDate(contact.birth_date)}
                    </p>
                  )}
                  {contact.whatsapp && (
                    <p className="text-sm text-gray-600">📱 {formatPhone(contact.whatsapp)}</p>
                  )}
                  {(contact.cidade || contact.estado) && (
                    <p className="text-sm text-gray-600 truncate">
                      📍 {contact.cidade}
                      {contact.cidade && contact.estado ? `, ${contact.estado}` : ""}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2"
                    onClick={() => router.push(`/contacts/edit?id=${contact.id}`)}
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </Button>
                  <ConfirmDelete
                    onConfirm={() => contact.id && deleteContact(contact.id)}
                    entityName="Contato"
                    disabled={isDeleting}
                  />
                </div>
              </CardContent>
            </Card>
          ))
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
  );
};

// Define o Layout global para a página
ContactsPage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default ContactsPage;
