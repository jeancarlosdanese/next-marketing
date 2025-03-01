// File: components/templates/TemplateForm.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TemplateService } from "@/services/template";
import { Template } from "@/types/template";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

interface TemplateFormProps {
  id?: string; // Opcional para diferenciar edição/criação
}

export default function TemplateForm({ id }: TemplateFormProps) {
  const { user, loading } = useUser();
  const router = useRouter();
  const isEditing = Boolean(id);

  const [template, setTemplate] = useState<Template>({
    id: "",
    name: "",
    description: "",
    channel: "email",
    created_at: "",
    updated_at: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isEditing || !id) {
      setIsLoading(false);
      return;
    }

    async function fetchTemplate() {
      try {
        const data = await TemplateService.getById(id as string);
        setTemplate(data);
      } catch (error) {
        toast.error("Erro ao carregar template");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemplate();
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTemplate({ ...template, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await TemplateService.updateTemplate(id as string, {
          name: template.name,
          description: template.description,
          channel: template.channel,
        });
        toast.success("Template atualizado com sucesso!");
      } else {
        await TemplateService.create({
          name: template.name,
          description: template.description,
          channel: template.channel,
        });
        toast.success("Template criado com sucesso!");
      }

      router.push("/templates");
    } catch (error) {
      toast.error("Erro ao salvar template");
    }
  };

  if (isLoading) return <p>Carregando...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">{isEditing ? "Editar Template" : "Novo Template"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          value={template.name}
          onChange={handleChange}
          placeholder="Nome do Template"
          required
        />
        <Input
          name="description"
          value={template.description}
          onChange={handleChange}
          placeholder="Descrição"
        />
        <select
          disabled={isEditing}
          name="channel"
          value={template.channel}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="email">E-mail</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/templates")}>
            Cancelar
          </Button>
          <Button type="submit">{isEditing ? "Salvar Alterações" : "Criar Template"}</Button>
        </div>
      </form>
    </div>
  );
}
