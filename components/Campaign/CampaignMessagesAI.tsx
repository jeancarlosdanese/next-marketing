// File: components/Campaing/CampaignMessagesAI.tsx

import { useEffect, useState } from "react";
import { CampaignService } from "@/services/campaign";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

interface CampaignMessagesAIProps {
  campaignId: string;
}

export function CampaignMessagesAI({ campaignId }: CampaignMessagesAIProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{
    preview: string;
    preview_type: "html" | "markdown";
    message: any;
  } | null>(null);

  useEffect(() => {
    async function fetchPreview() {
      try {
        const response = await CampaignService.generatePreview(campaignId, "email"); // ou "whatsapp"
        setPreview(response);
      } catch (error) {
        console.error("Erro ao gerar preview", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPreview();
  }, [campaignId]);

  if (loading) return <Spinner />;
  if (!preview) return <p>Nenhuma prévia gerada.</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">✨ Mensagem com IA</h2>
        {/* <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Gerando..." : "Gerar Mensagem com IA"}
        </Button> */}
      </div>

      {!preview && <p className="text-muted-foreground">Nenhuma mensagem gerada ainda.</p>}

      {loading && <Spinner />}

      {preview && (
        <>
          <div className="border rounded p-4 bg-muted space-y-4">
            <h3 className="font-semibold">Preview ({preview.preview_type.toUpperCase()})</h3>
            {preview.preview_type === "html" ? (
              <div
                dangerouslySetInnerHTML={{ __html: preview.preview || "<p>Sem conteúdo.</p>" }}
              />
            ) : (
              <pre className="whitespace-pre-wrap">{preview.preview || "Sem conteúdo."}</pre>
            )}
          </div>

          <div className="border rounded p-4 bg-muted space-y-2">
            <h4 className="font-semibold">Prompt Usado</h4>
            <pre className="text-sm whitespace-pre-wrap">{preview.message.prompt_usado}</pre>
          </div>
        </>
      )}
    </div>
  );
}
