// File: pages/templates.tsx

// File: pages/templates.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { TemplateService } from "@/services/template";
import { Template } from "@/types/template";
import Spinner from "@/components/Spinner";
import { Icon } from "lucide-react";

export default function TemplatesPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);

  // 🔹 Redirecionamento seguro para login
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;

    async function fetchTemplates() {
      try {
        const data = await TemplateService.getAllTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Erro ao carregar templates", error);
      }
    }

    fetchTemplates();
  }, [loading, user]);

  const deleteTemplate = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este template?")) return;

    try {
      await TemplateService.deleteTemplate(id);
      setTemplates((prev) => prev.filter((template) => template.id !== id));
    } catch (error) {
      console.error("Erro ao excluir template", error);
    }
  };

  if (loading) return <Spinner />;
  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header user={user} />
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Templates</h1>
          <Button onClick={() => router.push("/templates/new")}>➕ Novo Template</Button>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {templates.length > 0 ? (
            templates.map((template) => (
              <Card key={template.id} className="shadow-lg">
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">
                      Canal: <span className="font-semibold">{template.channel}</span>
                    </p>
                    {template.has_file ? (
                      <p className="text-sm text-gray-600">
                        Tem arquivo? <span className="font-semibold">📄 Sim</span>
                      </p>
                    ) : (
                      <Button
                        variant="default"
                        size="lg"
                        onClick={() => router.push(`/templates/${template.id}/upload`)}
                      >
                        📤 Upload Template
                      </Button>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/templates/${template.id}`)}
                    >
                      Ver detalhes
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/templates/edit?id=${template.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">Nenhum template encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
