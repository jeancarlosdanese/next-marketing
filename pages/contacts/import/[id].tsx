// File: pages/contacts/import/[id].tsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import { ContactService } from "@/services/contact";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

import ImportDetails from "@/components/ImportDetails";
import ImportConfig from "@/components/ImportConfig";
import { ContactImportConfig } from "@/types/contact";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/Spinner";

export default function EditImportPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { id } = router.query;

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
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (!id) return;

    async function fetchImport() {
      try {
        const data = await ContactService.getImportById(id as string);
        setImportData(data);

        if (data.config) {
          setConfig((prevConfig) => {
            if (!data.config || typeof data.config !== "object") return prevConfig;

            return Object.keys(prevConfig).reduce(
              (acc, key) => {
                acc[key as keyof ContactImportConfig] = {
                  source: data.config[key]?.source || "",
                  rules: typeof data.config[key]?.rules === "string" ? data.config[key].rules : "",
                };
                return acc;
              },
              { ...prevConfig }
            );
          });
        }

        if (data.preview?.headers && Array.isArray(data.preview.headers)) {
          setCsvHeaders([...new Set((data.preview.headers as string[]).map(String))]);
        }
      } catch (error) {
        toast.error("Erro ao carregar importação.");
      }
    }

    fetchImport();
  }, [id]);

  if (loading) return <Spinner />;
  if (!user) return null;
  if (!config) return <p>Configuração não encontrada.</p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <Header user={user} />

          <Card>
            <CardHeader>
              <CardTitle>Editar Importação</CardTitle>
            </CardHeader>
            <CardContent>
              <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
                <TabList className="flex border-b">
                  <Tab className="px-4 py-2 text-sm font-medium border-b-2">Detalhes</Tab>
                  <Tab className="px-4 py-2 text-sm font-medium border-b-2">Configuração</Tab>
                </TabList>

                <TabPanels className="mt-4">
                  <TabPanel>
                    <ImportDetails importData={importData} />
                  </TabPanel>
                  <TabPanel>
                    <ImportConfig config={config} setConfig={setConfig} csvHeaders={csvHeaders} />
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow p-4 flex justify-center">
        <Button onClick={() => ContactService.updateImportConfig(id as string, config)}>
          Salvar Configuração
        </Button>
      </div>
    </DndProvider>
  );
}
