// File: /pages/contacts/[id].tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { ContactService } from "@/services/contact";
import { Contact } from "@/types/contact";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";

const ContactDetailPage = () => {
  const { user, loading } = useUser();
  const [contact, setContact] = useState<Contact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && !user) return;
    if (!id) return;

    async function fetchContact() {
      try {
        const data = await ContactService.getById(id as string);
        setContact(data);
      } catch (error) {
        console.error("Erro ao carregar contato", error);
        setError("Erro ao carregar contato.");
      }
    }

    fetchContact();
  }, [loading, user, id]);

  if (loading || !user || !contact) return <Spinner />;
  if (!user || !contact) return null;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalhes do Contato</h1>
        <Button variant="default" onClick={() => router.push(`/contacts/edit?id=${contact.id}`)}>
          Editar Contato
        </Button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="bg-card shadow-lg p-6 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p>
            <strong>Nome:</strong> {contact.name}
          </p>
          <p>
            <strong>Email:</strong> {contact.email || "Não informado"}
          </p>
          <p>
            <strong>WhatsApp:</strong> {contact.whatsapp || "Não informado"}
          </p>
          <p>
            <strong>Nascimento:</strong> {contact.birth_date || "Não informado"}
          </p>
        </div>

        <p className="mt-4">
          <strong>Gênero:</strong> {contact.gender || "Não informado"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <p>
            <strong>Bairro:</strong> {contact.bairro || "Não informado"}
          </p>
          <p>
            <strong>Cidade:</strong> {contact.cidade || "Não informado"}
          </p>
          <p>
            <strong>Estado:</strong> {contact.estado || "Não informado"}
          </p>
        </div>

        {/* Exibição das listas (Interesses, Perfil e Eventos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <strong>Interesses:</strong>
            <p className="text-sm text-gray-600">
              {contact.tags?.interesses?.join(", ") || "Nenhum"}
            </p>
          </div>

          <div>
            <strong>Perfil:</strong>
            <p className="text-sm text-gray-600">{contact.tags?.perfil?.join(", ") || "Nenhum"}</p>
          </div>

          <div>
            <strong>Eventos:</strong>
            <p className="text-sm text-gray-600">{contact.tags?.eventos?.join(", ") || "Nenhum"}</p>
          </div>
        </div>

        {/* Histórico do contato */}
        <p className="mt-4">
          <strong>Histórico:</strong>
        </p>
        <p className="text-gray-600 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
          {contact.history || "Nenhuma informação registrada."}
        </p>
      </div>

      <div className="flex justify-end mt-6">
        <Button variant="outline" onClick={() => router.push("/contacts")}>
          Voltar
        </Button>
      </div>
    </div>
  );
};

// Define o Layout global para a página
ContactDetailPage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default ContactDetailPage;
