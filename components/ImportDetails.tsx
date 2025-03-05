// File: components/ImportDetails.tsx

import React from "react";

type ImportDetailsProps = {
  importData?: {
    file_name?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
  };
};

// 🔹 Função para formatação da data
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "Data inválida";
  }
};

export default function ImportDetails({ importData }: ImportDetailsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="font-semibold">Nome do Arquivo:</p>
        <p className="text-gray-600">{importData?.file_name || "N/A"}</p>
      </div>
      <div>
        <p className="font-semibold">Status:</p>
        <p
          className={`text-white px-2 py-1 rounded w-max ${
            importData?.status === "concluído"
              ? "bg-green-500"
              : importData?.status === "pendente"
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
        >
          {importData?.status || "N/A"}
        </p>
      </div>
      <div>
        <p className="font-semibold">Criado em:</p>
        <p className="text-gray-600">{formatDate(importData?.created_at)}</p>
      </div>
      <div>
        <p className="font-semibold">Última Atualização:</p>
        <p className="text-gray-600">{formatDate(importData?.updated_at)}</p>
      </div>
    </div>
  );
}
