// File: pages/contacts/edit.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import LayoutForm from "@/components/LayoutForm";
import { Input } from "@/components/ui/input";
import { ContactService } from "@/services/contact";
import { Textarea } from "@/components/ui/textarea";
import { Contact } from "@/types/contact";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditContactPage = () => {
  const { user, loading } = useUser();
  const [contact, setContact] = useState<Omit<Contact, "created_at" | "updated_at"> | null>(null);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!contact) return;
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!contact) return;

    if (!contact.name.trim()) {
      setError("O nome é obrigatório.");
      return;
    }

    try {
      await ContactService.update(id as string, contact);
      toast.success("Contato atualizado com sucesso!");
      router.push("/contacts");
    } catch (error) {
      console.error("Erro ao atualizar contato", error);
      setError("Erro ao atualizar contato. Tente novamente.");
    }
  };

  const handleTagsChange = (
    category: "interesses" | "perfil" | "eventos",
    value: string,
    resetInput: () => void
  ) => {
    if (!value.trim()) return;
    setContact((prev) => ({
      ...prev!,
      tags: {
        ...prev!.tags,
        [category]: [...(prev!.tags?.[category] || []), value.trim()],
      },
    }));

    resetInput();
  };

  const handleTagRemove = (category: "interesses" | "perfil" | "eventos", tag: string) => {
    setContact((prev) => ({
      ...prev!,
      tags: {
        ...prev!.tags,
        [category]: prev!.tags?.[category]?.filter((t) => t !== tag) || [],
      },
    }));
  };

  if (loading || !user || !contact) return <Spinner />;
  if (!user || !contact) return null;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6 sm:mb-4">Editar Contato</h1>

      <LayoutForm onSave={handleSubmit}>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <Input name="name" value={contact.name} onChange={handleChange} placeholder="Nome *" />
          <Input
            name="email"
            value={contact.email || ""}
            onChange={handleChange}
            placeholder="Email"
          />
          <Input
            name="whatsapp"
            value={contact.whatsapp || ""}
            onChange={handleChange}
            placeholder="WhatsApp"
          />
          <Input
            name="birth_date"
            type="date"
            value={contact.birth_date || ""}
            onChange={handleChange}
          />
        </div>

        <label className="block mt-3 sm:mt-4">Gênero:</label>
        <Select
          value={contact.gender || ""}
          onValueChange={(value: "masculino" | "feminino" | "outro") =>
            setContact({ ...contact, gender: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecionar Gênero" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="feminino">Feminino</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-4">
          <Input
            name="bairro"
            value={contact.bairro || ""}
            onChange={handleChange}
            placeholder="Bairro"
          />
          <Input
            name="cidade"
            value={contact.cidade || ""}
            onChange={handleChange}
            placeholder="Cidade"
          />
          <Input
            name="estado"
            value={contact.estado || ""}
            onChange={handleChange}
            placeholder="Estado"
          />
        </div>

        {/* 🔹 Campos de Listas (Interesses, Perfil e Eventos) - Reformulados com Badge */}
        {["interesses", "perfil", "eventos"].map((category) => (
          <div key={category}>
            <label className="block mt-3 sm:mt-4 capitalize">{category}:</label>
            <Input
              placeholder={`Adicione um ${category}`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const input = e.currentTarget;
                  handleTagsChange(
                    category as "interesses" | "perfil" | "eventos",
                    input.value,
                    () => (input.value = "")
                  );
                }
              }}
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {contact.tags?.[category as "interesses" | "perfil" | "eventos"]?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center space-x-2 px-2 py-1 text-xs font-semibold shadow-md transition
                    bg-teal-700 border-teal-800 text-white hover:bg-teal-800 hover:border-teal-900
                    dark:bg-teal-700 dark:border-teal-800 dark:hover:bg-teal-800 dark:hover:border-teal-900"
                >
                  {tag}
                  <button
                    className="ml-1 text-white hover:text-gray-100 focus:outline-none"
                    onClick={() =>
                      handleTagRemove(category as "interesses" | "perfil" | "eventos", tag)
                    }
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        ))}

        {/* Campo Histórico */}
        <label className="block mt-3 sm:mt-4">Histórico:</label>
        <Textarea
          placeholder="Type your message here."
          value={contact.history || ""}
          onChange={(e) => setContact({ ...contact, history: e.target.value })}
          className="w-full p-2 border rounded resize-y min-h-[115px]"
        />
      </LayoutForm>
    </div>
  );
};

EditContactPage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default EditContactPage;
