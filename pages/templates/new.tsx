// File: pages/templates/new.tsx

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function NewTemplatePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [template, setTemplate] = useState<Omit<
    Template,
    "id" | "created_at" | "updated_at"
  > | null>({
    name: "",
    description: "",
    channel: "email",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!template) return;
    setTemplate({ ...template, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!template) return;

    if (!template.name.trim()) {
      toast.error("Nome do template é obrigatório");
      return;
    }

    try {
      await TemplateService.create(template);
      toast.success("Template criado com sucesso!");
      router.push("/templates");
    } catch (error) {
      toast.error("Erro ao criar template");
    }
  };

  if (loading || !user || !template) return <Spinner />;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Novo Template</h1>

      <LayoutForm onSave={handleSubmit}>
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
        </div>
      </LayoutForm>
    </div>
  );
}

// Aplica o layout global
NewTemplatePage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;
