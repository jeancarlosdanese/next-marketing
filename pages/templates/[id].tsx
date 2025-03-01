// File: pages/templates/[id].tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
import { TemplateService } from "@/services/template";
import { Template } from "@/types/template";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";

export default function TemplateDetailsPage() {
  const { user, loading } = useUser();
  const [template, setTemplate] = useState<Template | null>(null);
  const router = useRouter();
  const { id } = router.query;

  // 🔹 Redirecionamento seguro para login
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;

    async function fetchTemplate() {
      try {
        if (id) {
          const data = await TemplateService.getById(id as string);
          setTemplate(data);
        }
      } catch (error) {
        toast.error("Erro ao carregar template");
        router.push("/templates");
      }
    }

    fetchTemplate();
  }, [loading, user, id, router]);

  if (loading) return <Spinner />;
  if (!user) return null;
  if (!template) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{template.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Descrição:</strong> {template.description || "Sem descrição"}
          </p>
          <p>
            <strong>Canal:</strong> {template.channel === "email" ? "📧 E-mail" : "📱 WhatsApp"}
          </p>
          <p>
            <strong>Criado em:</strong> {new Date(template.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Última atualização:</strong>{" "}
            {new Date(template.updated_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Tem arquivo?</strong> {template.has_file ? "📄 Sim" : "❌ Não"}
          </p>

          <div className="mt-6 flex gap-2">
            <Button
              variant="default"
              size="lg"
              onClick={() => router.push(`/templates/${template.id}/upload`)}
            >
              📤 Upload Template
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/templates/edit?id=${template.id}`)}
            >
              Editar
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/templates")}>
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
