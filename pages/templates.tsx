// File: pages/templates.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateService } from "@/services/template";
import { Template } from "@/types/template";
import Spinner from "@/components/Spinner";
import Layout from "@/components/Layout";
import { UploadCloud, Trash, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";

const TemplatesPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirecionamento seguro para login
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
    setIsDeleting(true);

    try {
      await TemplateService.delete(id);
      setTemplates((prev) => prev.filter((template) => template.id !== id));

      toast.success("Template excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir template", error);
      toast.error("Erro ao excluir template. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!user) return null;

  return (
    <div className="p-6">
      {/* 🔹 Ajuste para responsividade no título e botão */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Button className="w-full sm:w-auto" onClick={() => router.push("/templates/new")}>
          ➕ Novo Template
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {templates.length > 0 ? (
          templates.map((template) => (
            <Card key={template.id} className="shadow-lg">
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>
                    📢 Canal: <strong>{template.channel}</strong>
                  </span>
                  <span>{template.has_file ? "📄 Tem arquivo" : "❌ Sem arquivo"}</span>
                </div>

                {!template.has_file && (
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full flex gap-2"
                    onClick={() => router.push(`/templates/${template.id}/upload`)}
                  >
                    <UploadCloud className="w-4 h-4" />
                    Upload Template
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2"
                    onClick={() => router.push(`/templates/edit?id=${template.id}`)}
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </Button>
                  <ConfirmDelete
                    onConfirm={() => deleteTemplate(template.id)}
                    entityName="Template"
                    disabled={isDeleting}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">Nenhum template encontrado.</p>
        )}
      </div>
    </div>
  );
};

// Define o Layout global para a página
TemplatesPage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default TemplatesPage;
