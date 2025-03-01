// File: pages/templates/[id]/upload.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
import { TemplateService } from "@/services/template";
import { Template } from "@/types/template";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import Spinner from "@/components/Spinner";

export default function UploadTemplatePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { id } = router.query;
  const [template, setTemplate] = useState<Template | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!id || loading || !user) return;

    async function fetchTemplate() {
      try {
        const data = await TemplateService.getById(id as string);
        setTemplate(data);
      } catch (error) {
        toast.success("Erro ao carregar template");
        router.push("/templates");
      }
    }

    fetchTemplate();
  }, [id, loading, user, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      toast.info("Selecione um arquivo para enviar.");
      return;
    }

    setFile(selectedFile);

    // 🔹 Criar pré-visualização para garantir que o arquivo foi carregado corretamente
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsText(selectedFile);

    toast.success("Arquivo carregado com sucesso.");
  };

  const handleUpload = async () => {
    if (!file || !template) {
      toast.info("Selecione um arquivo para enviar.");
      return;
    }

    setIsUploading(true);
    try {
      await TemplateService.uploadTemplate(template.id, file, template.channel);
      toast.success("Template enviado com sucesso.");
      router.push(`/templates/${template.id}`);
    } catch (error) {
      toast.error("Erro ao enviar template.");
      console.error("❌ Erro ao enviar template:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!user) return null;
  if (!template) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header user={user} />
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Upload de Template</h1>
          <p>
            <strong>Nome:</strong> {template.name}
          </p>
          <p>
            <strong>Canal:</strong>{" "}
            {template.channel === "email" ? "📧 E-mail (HTML)" : "📱 WhatsApp (Markdown)"}
          </p>

          <div className="mt-4">
            <Input
              type="file"
              accept={template?.channel === "whatsapp" ? ".md" : ".html"} // 🔹 Garante que sempre há um valor válido
              onChange={handleFileChange}
            />

            {preview && (
              <div className="mt-4 p-4 border rounded bg-gray-50">
                <p className="font-bold mb-2">Pré-visualização:</p>
                <div className="border p-2 bg-white text-sm max-h-40 overflow-auto">
                  <pre>{preview}</pre>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => router.push(`/templates/${template.id}`)}>
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Enviando..." : "Enviar Template"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
