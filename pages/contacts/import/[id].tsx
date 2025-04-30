// File: pages/contacts/import/[id].tsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Layout from "@/components/Layout";
import { ContactService } from "@/services/contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import ImportDetails from "@/components/ImportDetails";
import ImportConfig from "@/components/ImportConfig";
import { ContactImportConfig } from "@/types/contact";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/Spinner";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";

export default function EditImportPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { id } = router.query;

  const tabFromQuery = router.query.tab;
  const [importData, setImportData] = useState<any>(null);
  const [config, setConfig] = useState<ContactImportConfig>(() => ({
    about_data: { source: "", rules: "" },
    name: { source: "", rules: "" },
    email: { source: "", rules: "" },
    whatsapp: { source: "", rules: "" },
    gender: { source: "", rules: "" },
    birth_date: { source: "", rules: "" },
    bairro: { source: "", rules: "" },
    cidade: { source: "", rules: "" },
    estado: { source: "", rules: "" },
    interesses: { source: "", rules: "" },
    perfil: { source: "", rules: "" },
    eventos: { source: "", rules: "" },
    history: { source: "", rules: "" },
    last_contact_at: { source: "", rules: "" },
  }));
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState(tabFromQuery === "config" ? "config" : "details");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchImport() {
      try {
        const data = await ContactService.getImportById(id as string);
        setImportData(data);

        if (data.config) {
          setConfig((prevConfig) => {
            if (!data.config || typeof data.config !== "object") return prevConfig;

            return Object.keys(prevConfig || {}).reduce((acc, key) => {
              acc[key as keyof ContactImportConfig] = {
                source: data.config[key]?.source || "",
                rules: typeof data.config[key]?.rules === "string" ? data.config[key].rules : "",
              };
              return acc;
            }, {} as ContactImportConfig);
          });
        }

        if (data.preview?.headers && Array.isArray(data.preview.headers)) {
          setCsvHeaders([...new Set((data.preview.headers as string[]).map(String))]);
        }
      } catch (error) {
        toast.error("Erro ao carregar importação.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchImport();
  }, [id]);

  const handleSaveConfig = async () => {
    if (!config) return;
    try {
      await ContactService.updateImportConfig(id as string, config);
      toast.success("Configuração salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configuração.");
    }
  };

  const handleStartProcessing = async () => {
    if (!id) return;

    setIsProcessing(true);

    try {
      const result = await ContactService.startImport(id as string);
      toast.success(`Processamento iniciado com sucesso!`);

      // Redirecionar ao final
      router.push("/contacts/import/history");
    } catch (error) {
      toast.error("Erro ao processar importação.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteImport = async () => {
    if (!id) return;

    try {
      await ContactService.deleteImport(id as string);
      toast.success("Importação deletada com sucesso!");
      router.push("/contacts/import/history"); // Redireciona para a página de listagem
    } catch (error) {
      toast.error("Erro ao deletar importação.");
    }
  };

  if (loading || isLoading) return <Spinner />;
  if (!user || !config)
    return <p className="text-center text-gray-500">Configuração não encontrada.</p>;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Importação</h1>
      <DndProvider backend={HTML5Backend}>
        <Card>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <div className="flex justify-between items-center pt-6 pb-4">
                <TabsList className="md-4">
                  <TabsTrigger value="details">Detalhes</TabsTrigger>
                  <TabsTrigger value="config">Configuração</TabsTrigger>
                </TabsList>

                {importData && importData.status === "pendente" && (
                  <ConfirmDelete
                    onConfirm={() => handleDeleteImport()}
                    entityName="Importação"
                    label="Excluir Importação"
                  />
                )}
              </div>

              <TabsContent value="details">
                <ImportDetails importData={importData} />
              </TabsContent>
              <TabsContent value="config">
                <ImportConfig config={config} setConfig={setConfig} csvHeaders={csvHeaders} />
                <div className="flex flex-row gap-2 mt-8">
                  {importData?.status === "pendente" && (
                    <Button onClick={handleSaveConfig}>Salvar Configuração</Button>
                  )}
                  {importData?.status === "pendente" && (
                    <Button
                      variant="default"
                      onClick={handleStartProcessing}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Iniciando..." : "Iniciar Processamento"}
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </DndProvider>
    </div>
  );
}

EditImportPage.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;
