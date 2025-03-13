// File: pages/templates/[id]/edit.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
import Layout from "@/components/Layout";
import LayoutForm from "@/components/LayoutForm";
import { TemplateService } from "@/services/template";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import { Template } from "@/types/template";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function EditTemplatePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);
  const [template, setTemplate] = useState<Omit<Template, "created_at" | "updated_at"> | null>(
    null
  );

  useEffect(() => {
    if (!loading && !user) return;
    if (!id) return;

    async function fetchTemplate() {
      setTemplate(null); // 🔹 Garante que o template começa como null para exibir o Spinner
      try {
        const data = await TemplateService.getById(id as string);
        setTemplate(data);
      } catch (error) {
        toast.error("Erro ao carregar template");
      }
    }

    fetchTemplate();
  }, [loading, user, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!template) return;
    setTemplate({ ...template, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!template) return;

    if (!template.name) {
      toast.error("Nome do template é obrigatório");
      return;
    }

    try {
      await TemplateService.update(id as string, template);
      toast.success("Template atualizado com sucesso!");
      router.push("/templates");
    } catch (error) {
      toast.error("Erro ao salvar template");
    }
  };

  if (loading || !user || !template) return <Spinner />;
  if (!user || !template) return null;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Template</h1>

      <LayoutForm onSave={handleSubmit} onCancel={() => router.push("/templates")}>
        <div className="space-y-4">
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

          <Select
            disabled
            value={template.channel}
            onValueChange={(value: "email" | "whatsapp") =>
              setTemplate({ ...template, channel: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecionar Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">E-mail</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>

          <p>
            <strong>Tem arquivo?</strong> {template.has_file ? "📄 Sim" : "❌ Não"}
          </p>
          <Button
            variant="default"
            size="lg"
            onClick={() => router.push(`/templates/${template.id}/upload`)}
          >
            📤 Upload Template
          </Button>
        </div>
      </LayoutForm>
    </div>
  );
}

// Aplica o layout global
EditTemplatePage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;
