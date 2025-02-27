// File: /pages/contacts/[id].tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ContactService } from "@/services/contact";
import { Contact } from "@/types/contact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContactDetailsPage() {
  const [contact, setContact] = useState<Contact | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchContact() {
      try {
        if (id) {
          const data = await ContactService.getById(id as string);
          setContact(data);
        }
      } catch (error) {
        console.error("Erro ao carregar contato", error);
        router.push("/contacts");
      }
    }

    fetchContact();
  }, [id, router]);

  if (!contact) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{contact.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Email:</strong> {contact.email || "Não informado"}
          </p>
          <p>
            <strong>WhatsApp:</strong> {contact.whatsapp || "Não informado"}
          </p>
          <p>
            <strong>Gênero:</strong> {contact.gender || "Não informado"}
          </p>
          <p>
            <strong>Data de Nascimento:</strong> {contact.birth_date || "Não informado"}
          </p>
          <p>
            <strong>Endereço:</strong> {contact.bairro}, {contact.cidade} - {contact.estado}
          </p>
          <p>
            <strong>Histórico:</strong> {contact.history || "Nenhum histórico disponível"}
          </p>

          {/* Tags */}
          <div className="mt-4">
            <p>
              <strong>Interesses:</strong> {contact.tags?.interesses?.join(", ") || "Nenhum"}
            </p>
            <p>
              <strong>Perfil:</strong> {contact.tags?.perfil?.join(", ") || "Nenhum"}
            </p>
            <p>
              <strong>Eventos:</strong> {contact.tags?.eventos?.join(", ") || "Nenhum"}
            </p>
          </div>

          <div className="mt-6 flex gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/contacts/edit?id=${contact.id}`)}
            >
              Editar
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/contacts")}>
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
