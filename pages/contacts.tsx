// File: pages/contacts.tsx

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ContactService } from "@/services/contact";
import { Contact } from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paginator as PaginatorType } from "@/types/paginator";
import Paginator from "@/components/Paginator";
import { format } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import Spinner from "@/components/Spinner";
import Layout from "@/components/Layout";
import { Trash, Pencil, UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";

const ContactsPage = () => {
  const { user, loading } = useUser();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatorType<Contact>, "data">>({
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
      {/* 🔹 Cabeçalho e botões responsivos */}
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
              <CardHeader>
                <CardTitle>{contact.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="grid grid-cols-2 gap-3">
                  {/* Primeira coluna */}
                  <div>
                    <p
                      className="text-sm text-blue-600 font-semibold truncate"
                      title={contact.email || "Não informado"}
                    >
                      📧 {contact.email || "Não informado"}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      🎂 Nascimento: {formatDate(contact.birth_date)}
                    </p>
                  </div>

                  {/* Segunda coluna */}
                  <div>
                    <p className="text-sm text-gray-600">📱 {formatPhone(contact.whatsapp)}</p>
                    <p className="text-sm text-gray-600 truncate">
                      📍{" "}
                      {contact.cidade
                        ? `${contact.cidade}, ${contact.estado || ""}`
                        : "Não informado"}
                    </p>
                  </div>
                </div>
              </CardContent>

              {/* 🔹 Botões no final do Card */}
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2"
                    onClick={() => router.push(`/contacts/edit?id=${contact.id}`)}
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </Button>
                  {/* 🔹 Modal de Confirmação de Exclusão */}
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
