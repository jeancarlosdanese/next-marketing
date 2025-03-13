// File: pages/templates/[id]/upload.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
import { TemplateService } from "@/services/template";
import { Template } from "@/types/template";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import ReactMarkdown from "react-markdown";
import { Editor } from "@monaco-editor/react";

export default function UploadTemplatePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { id } = router.query;
  const [template, setTemplate] = useState<Template | null>(null);
  const [content, setContent] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

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
        setContent(data.content || "");

        setFileName(
          data.has_file ? `${data.name}.${data.channel === "email" ? "html" : "md"}` : null
        );

        // 🔹 Tenta baixar o template salvo
        const downloadedContent = await TemplateService.downloadTemplate(
          id as string,
          data.channel
        );
        if (downloadedContent) setContent(downloadedContent);
      } catch (error) {
        toast.error("Erro ao carregar template");
        router.push("/templates");
      }
    }

    fetchTemplate();
  }, [id, loading, user, router]);

  const handleUpload = async () => {
    if (!content || !template) {
      toast.info("Adicione um conteúdo antes de enviar.");
      return;
    }

    setIsUploading(true);
    try {
      const file = new File(
        [content],
        `${template.name}.${template.channel === "email" ? "html" : "md"}`,
        { type: "text/plain" }
      );
      await TemplateService.uploadTemplate(template.id, file, template.channel);
      toast.success("Template enviado com sucesso.");
      router.push(`/templates/edit?id=${template.id}`);
    } catch (error) {
      toast.error("Erro ao enviar template.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // Define o nome do arquivo, utilizando o fileName se disponível
    a.download = fileName || "template.txt";
    document.body.appendChild(a); // Necessário para alguns navegadores
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name); // Exibe o nome do arquivo
    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => setContent(e.target?.result as string), 300); // Atraso para evitar flickering
    };
    reader.readAsText(file);
  };

  if (loading) return <Spinner />;
  if (!user || !template) return null;

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 flex flex-col gap-4">
        <Header />

        {/* Área de Botões */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <h1 className="text-lg font-bold text-center md:text-left">
            {template.channel === "email" ? "Edição de HTML" : "Edição de Markdown"}
          </h1>
          <p className="text-sm text-gray-400">
            {template.channel === "email"
              ? "Edite o HTML do seu template de e-mail"
              : "Edite o Markdown do seu template de WhatsApp"}
          </p>

          <div className="flex flex-col md:flex-row gap-2 px-2">
            <input
              type="file"
              accept=".html,.md"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button variant="default" asChild>
              <label htmlFor="file-upload">
                {fileName ? `📂 ${fileName}` : "Escolher Arquivo"}
              </label>
            </Button>
            {content && (
              <>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? "Enviando..." : "Enviar Template"}
                </Button>
                <Button onClick={handleDownload}>Download</Button>
              </>
            )}
            <Button
              variant="default"
              onClick={() => router.push(`/templates/edit?id=${template.id}`)}
            >
              Cancelar
            </Button>
          </div>
        </div>

        {/* Container para Source e View empilhados em mobile */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Source */}
          <div className="flex-1 rounded-md shadow p-4 bg-[#1e1e1e] text-[#d4d4d4]">
            <p className="font-semibold mb-2">Fonte do Template</p>
            <Editor
              height="70vh"
              defaultLanguage={template.channel === "email" ? "html" : "markdown"}
              value={content}
              onChange={(value) => setContent(value || "")}
              theme={"vs-dark"} // Mantém o padrão VSCode default
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>

          {/* View */}
          <div className="flex-1 rounded-md shadow p-4 bg-card text-card-foreground">
            <p className="font-semibold mb-2">Pré-visualização</p>
            {template.channel === "email" ? (
              <div
                className="border rounded p-4 bg-muted"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="prose dark:prose-invert border rounded p-4 transition-colors bg-muted">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
