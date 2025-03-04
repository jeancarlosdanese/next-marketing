// File: components/UploadCSV.tsx

import { useState } from "react";
import { ContactService } from "@/services/contact";

const UploadCSV = () => {
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
    if (!file) return alert("Selecione um arquivo CSV primeiro!");

    setLoading(true);

    try {
      const data = await ContactService.importContacts(file);
      setPreview(data.preview); // Atualiza o preview com os dados retornados pela API
    } catch (error) {
      alert("Erro ao importar o CSV. Verifique o formato do arquivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Importar Contatos</h2>

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

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar CSV"}
      </button>

      {preview && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Pré-visualização</h3>
          <table className="w-full border border-gray-300">
            <tbody>
              {preview.map((row, index) => (
                <tr key={index} className="border">
                  {row.map((cell, i) => (
                    <td key={i} className="p-2 border">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadCSV;
