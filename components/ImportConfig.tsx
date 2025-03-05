// File: components/ImportConfig.tsx

import React from "react";
import MappingField from "@/components/MappingField";
import CSVTag from "@/components/CSVTag";
import { ContactImportConfig } from "@/types/contact";

interface ImportConfigProps {
  config: ContactImportConfig;
  setConfig: React.Dispatch<React.SetStateAction<ContactImportConfig>>;
  csvHeaders: string[];
}

// 🔹 Campos disponíveis para mapeamento no CRM
const CRM_FIELDS = [
  "about_data",
  "name",
  "email",
  "whatsapp",
  "gender",
  "birth_date",
  "bairro",
  "cidade",
  "estado",
  "interesses",
  "perfil",
  "eventos",
  "history",
  "last_contact_at",
] as const;

export default function ImportConfig({ config, setConfig, csvHeaders }: ImportConfigProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 🔹 Lista de tags disponíveis para mapeamento */}
      <div className="bg-card p-4 border rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Campos do CSV</h3>
        <div className="flex flex-wrap gap-2">
          {csvHeaders.length > 0 ? (
            csvHeaders.map((header) => <CSVTag key={header} name={header} />)
          ) : (
            <p className="text-gray-500 text-sm">Nenhum campo encontrado no CSV.</p>
          )}
        </div>
      </div>

      {/* 🔹 Campos de mapeamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CRM_FIELDS.map((fieldKey) => (
          <MappingField key={fieldKey} fieldKey={fieldKey} config={config} setConfig={setConfig} />
        ))}
      </div>
    </div>
  );
}
