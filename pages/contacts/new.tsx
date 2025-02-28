// File: pages/contacts/new.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ContactService } from "@/services/contact";
import { Contact } from "@/types/contact";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/Spinner";

export default function NewContactPage() {
  const { user, loading } = useUser();
  const [contact, setContact] = useState<Omit<Contact, "id" | "created_at" | "updated_at">>({
    name: "",
    email: "",
    whatsapp: "",
    gender: undefined,
    birth_date: "",
    bairro: "",
    cidade: "",
    estado: "",
    tags: { interesses: [], perfil: [], eventos: [] },
    history: "",
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleTagsChange = (category: "interesses" | "perfil" | "eventos", value: string) => {
    setContact((prev) => ({
      ...prev,
      tags: {
        ...prev.tags,
        [category]: [...(prev.tags?.[category] || []), value],
      },
    }));
  };

  const handleSubmit = async () => {
    if (!contact.name.trim()) {
      setError("O nome é obrigatório.");
      return;
    }

    try {
      await ContactService.create(contact);
      router.push("/contacts");
    } catch (error) {
      console.error("Erro ao criar contato", error);
      setError("Erro ao criar contato. Tente novamente.");
    }
  };

  // 🔹 Redirecionamento seguro dentro do useEffect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  if (loading) return <Spinner />; // 🔹 Agora o spinner está fora do retorno condicional do React
  if (!user) return null; // 🔹 Evita exibição de conteúdo antes do redirecionamento

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Novo Contato</CardTitle>
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
            Criar Contato
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
