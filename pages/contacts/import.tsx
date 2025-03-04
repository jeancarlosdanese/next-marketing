// File: pages/contacts/import.tsx

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ContactService } from "@/services/contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ImportContactsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Selecione um arquivo CSV primeiro!");

    setLoading(true);

    try {
      const data = await ContactService.importContacts(file);

      // ✅ Agora acessamos corretamente os headers e as rows
      if (data.preview && data.preview.headers && data.preview.rows) {
        setPreview({
          headers: data.preview.headers,
          rows: data.preview.rows,
        });
      } else {
        toast.warning("Nenhum preview disponível.");
      }
    } catch (error) {
      toast.error("Erro ao importar o CSV. Verifique o formato do arquivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header />
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Importar Contatos</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full p-2 border border-gray-300 rounded mb-4"
              />

              {file && (
                <div className="mb-4">
                  <p>
                    <strong>Arquivo:</strong> {file.name}
                  </p>
                  <p>
                    <strong>Tamanho:</strong> {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              <Button onClick={handleUpload} disabled={!file || loading}>
                {loading ? "Enviando..." : "Enviar CSV"}
              </Button>

              {/* Show preview of file */}
              {preview && preview.headers.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Pré-visualização</h3>
                  <div className="overflow-auto max-w-full max-h-64 border border-gray-300 rounded-lg">
                    <table className="table-auto w-full text-sm text-left">
                      <thead className="bg-gray-200">
                        <tr>
                          {preview.headers.map((header, i) => (
                            <th key={i} className="p-2 border">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.rows.length > 0 ? (
                          preview.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border">
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="p-2 border whitespace-nowrap">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={preview.headers.length} className="p-2 text-center">
                              Nenhum dado disponível no preview.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-gray-500">Nenhum preview disponível.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
