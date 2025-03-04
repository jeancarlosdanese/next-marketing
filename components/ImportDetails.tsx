// File: components/ImportDetails.tsx

import React from "react";

export default function ImportDetails({ importData }: { importData: any }) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <strong>Nome do Arquivo:</strong>
        <p>{importData?.file_name || "N/A"}</p>
      </div>
      <div>
        <strong>Status:</strong>
        <p>{importData?.status || "N/A"}</p>
      </div>
      <div>
        <strong>Criado em:</strong>
        <p>{formatDate(importData?.created_at)}</p>
      </div>
      <div>
        <strong>Última Atualização:</strong>
        <p>{formatDate(importData?.updated_at)}</p>
      </div>
    </div>
  );
}
