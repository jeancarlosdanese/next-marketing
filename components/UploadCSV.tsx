// File: components/UploadCSV.tsx

import { useState } from "react";
import { ContactService } from "@/services/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UploadCSV() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setPreview(null); // Reseta o preview ao trocar de arquivo
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Selecione um arquivo CSV primeiro!");
      return;
    }

    setLoading(true);

    try {
      const data = await ContactService.importContacts(file);
      setPreview(data.preview); // Atualiza o preview com os dados retornados pela API
      toast.success("Arquivo enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao importar o CSV. Verifique o formato do arquivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Importar Contatos</h1>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Importação de Arquivo CSV</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Input para upload */}
          <Input type="file" accept=".csv" onChange={handleFileChange} />

          {file && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                <strong>Arquivo:</strong> {file.name}
              </p>
              <p>
                <strong>Tamanho:</strong> {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          {/* Botão de envio */}
          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="mt-4 w-full sm:w-auto"
          >
            {loading ? "Enviando..." : "Enviar CSV"}
          </Button>

          {/* Pré-visualização do CSV */}
          {preview && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Pré-visualização</h3>
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {preview[0].map((cell, i) => (
                        <TableHead key={i}>{cell}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.slice(1).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
