// File: pages/contacts/import/history.tsx

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ContactService } from "@/services/contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";

export default function ImportHistoryPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [imports, setImports] = useState<
    { id: string; file_name: string; status: string; created_at: string; updated_at: string }[]
  >([]);

  useEffect(() => {
    async function fetchImports() {
      try {
        const data = await ContactService.getImports();
        setImports(data);
      } catch (error) {
        console.error("Erro ao carregar importações", error);
      }
    }

    fetchImports();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Header user={user} />
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Importações de Contatos</h1>
          <div className="flex gap-4">
            <Button onClick={() => router.push("/contacts/import")}>Nova Importação</Button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Importações</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Spinner />
              ) : imports?.length === 0 ? (
                <p className="text-gray-500">Nenhuma importação encontrada.</p>
              ) : (
                <table className="table-auto w-full text-sm text-left border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-2 border">Arquivo</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Criado</th>
                      <th className="p-2 border">Última Atualização</th>
                    </tr>
                  </thead>
                  <tbody>
                    {imports?.map((imp) => (
                      <tr key={imp.id} className="border">
                        <td className="p-2 border">
                          <a
                            href={`/contacts/import/${imp.id}`}
                            className="text-blue-500 hover:underline"
                          >
                            {imp.file_name}
                          </a>
                        </td>
                        <td className="p-2 border">
                          <span
                            className={`px-2 py-1 rounded text-white ${imp.status === "concluído" ? "bg-green-500" : imp.status === "pendente" ? "bg-yellow-500" : "bg-red-500"}`}
                          >
                            {imp.status}
                          </span>
                        </td>
                        <td className="p-2 border">{new Date(imp.created_at).toLocaleString()}</td>
                        <td className="p-2 border">{new Date(imp.updated_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
