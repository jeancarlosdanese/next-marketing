// File: pages/contacts/edit.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ContactService } from "@/services/contact";
import { Contact } from "@/types/contact";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";

export default function EditContactPage() {
  const { user, loading } = useUser();
  const [contact, setContact] = useState<Omit<Contact, "created_at" | "updated_at"> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  // 🔹 Redirecionamento seguro dentro do useEffect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;
    async function fetchContact() {
      if (!id) return;

      try {
        const data = await ContactService.getById(id as string);
        setContact(data);
      } catch (error) {
        console.error("Erro ao carregar contato", error);
        setError("Erro ao carregar contato.");
      }
    }

    fetchContact();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!contact) return;
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleTagsChange = (category: "interesses" | "perfil" | "eventos", value: string) => {
    if (!contact) return;
    setContact((prev) => ({
      ...prev!,
      tags: {
        ...prev!.tags,
        [category]: [...(prev!.tags?.[category] || []), value],
      },
    }));
  };

  const handleSubmit = async () => {
    if (!contact) return;

    if (!contact.name.trim()) {
      setError("O nome é obrigatório.");
      return;
    }

    try {
      await ContactService.update(id as string, contact);
      router.push("/contacts");
    } catch (error) {
      console.error("Erro ao atualizar contato", error);
      setError("Erro ao atualizar contato. Tente novamente.");
    }
  };

  if (!contact) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Editar Contato</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <Input name="name" value={contact.name} onChange={handleChange} placeholder="Nome *" />
          <Input
            name="email"
            value={contact.email || ""}
            onChange={handleChange}
            placeholder="Email"
            className="mt-2"
          />
          <Input
            name="whatsapp"
            value={contact.whatsapp || ""}
            onChange={handleChange}
            placeholder="WhatsApp"
            className="mt-2"
          />

          <label className="block mt-4">Gênero:</label>
          <select
            name="gender"
            value={contact.gender || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecionar</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>

          <label className="block mt-4">Data de Nascimento:</label>
          <Input
            type="date"
            name="birth_date"
            value={contact.birth_date || ""}
            onChange={handleChange}
          />

          <Input
            name="bairro"
            value={contact.bairro || ""}
            onChange={handleChange}
            placeholder="Bairro"
            className="mt-2"
          />
          <Input
            name="cidade"
            value={contact.cidade || ""}
            onChange={handleChange}
            placeholder="Cidade"
            className="mt-2"
          />
          <Input
            name="estado"
            value={contact.estado || ""}
            onChange={handleChange}
            placeholder="Estado"
            className="mt-2"
          />

          <label className="block mt-4">Histórico:</label>
          <textarea
            name="history"
            value={contact.history || ""}
            onChange={(e) => setContact({ ...contact, history: e.target.value })}
            className="w-full p-2 border rounded"
            rows={3}
          ></textarea>

          {/* Campos para Tags */}
          <div className="mt-4">
            <label>Interesses:</label>
            <Input
              placeholder="Adicione um interesse"
              onKeyDown={(e) =>
                e.key === "Enter" && handleTagsChange("interesses", e.currentTarget.value)
              }
            />
            <p className="text-sm text-gray-600">
              {contact.tags?.interesses?.join(", ") || "Nenhum"}
            </p>
          </div>

          <div className="mt-4">
            <label>Perfil:</label>
            <Input
              placeholder="Adicione um perfil"
              onKeyDown={(e) =>
                e.key === "Enter" && handleTagsChange("perfil", e.currentTarget.value)
              }
            />
            <p className="text-sm text-gray-600">{contact.tags?.perfil?.join(", ") || "Nenhum"}</p>
          </div>

          <div className="mt-4">
            <label>Eventos:</label>
            <Input
              placeholder="Adicione um evento"
              onKeyDown={(e) =>
                e.key === "Enter" && handleTagsChange("eventos", e.currentTarget.value)
              }
            />
            <p className="text-sm text-gray-600">{contact.tags?.eventos?.join(", ") || "Nenhum"}</p>
          </div>

          <Button onClick={handleSubmit} className="w-full mt-4">
            Salvar Alterações
          </Button>
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => router.push("/contacts")}
          >
            Cancelar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
