// File: pages/contacts/new.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import LayoutForm from "@/components/LayoutForm";
import { Input } from "@/components/ui/input";
import { ContactService } from "@/services/contact";
import { Textarea } from "@/components/ui/textarea";
import { Contact } from "@/types/contact";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NewContactPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();

  // Estado inicial do contato
  const [contact, setContact] = useState<Omit<Contact, "id" | "created_at" | "updated_at">>({
    name: "",
    email: "",
    whatsapp: "",
    birth_date: "",
    gender: undefined,
    bairro: "",
    cidade: "",
    estado: "",
    history: "",
    tags: {
      interesses: [],
      perfil: [],
      eventos: [],
    },
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
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

  const handleSubmit = async () => {
    if (!contact.name.trim()) {
      setError("O nome é obrigatório.");
      return;
    }

    try {
      await ContactService.create(contact);
      toast.success("Contato criado com sucesso!");
      router.push("/contacts");
    } catch (error) {
      console.error("Erro ao criar contato", error);
      toast.error("Erro ao criar contato. Tente novamente.");
    }
  };

  if (loading || !user) return null;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6 sm:mb-4">Novo Contato</h1>

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

NewContactPage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default NewContactPage;
