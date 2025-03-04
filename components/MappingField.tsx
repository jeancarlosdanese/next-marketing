// File: components/MappingField.tsx

import React from "react";
import { useDrop } from "react-dnd";
import { ContactImportConfig } from "@/types/contact";

interface MappingFieldProps {
  fieldKey: string;
  config: ContactImportConfig;
  setConfig: React.Dispatch<React.SetStateAction<ContactImportConfig>>;
}

export default function MappingField({ fieldKey, config, setConfig }: MappingFieldProps) {
  const fieldMapping = config[fieldKey] || { source: "", rules: "" };

  // Permite que as tags sejam soltas no campo
  const [{ isOver }, dropRef] = useDrop({
    accept: "CSV_TAG",
    drop: (item: { name: string }) => {
      const newTag = item.name.trim();

      // Se já existe algo em source, mesclar valores evitando duplicações
      const existingSources = fieldMapping.source
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (!existingSources.includes(newTag)) {
        existingSources.push(newTag);
      }

      // Atualiza o estado global do config
      setConfig((prev) => ({
        ...prev,
        [fieldKey]: {
          ...prev[fieldKey],
          source: existingSources.join(","), // Exemplo: "nome,email"
        },
      }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Remove uma tag associada ao campo
  const handleRemoveTag = (tag: string) => {
    const newSources = fieldMapping.source
      .split(",")
      .map((s) => s.trim())
      .filter((t) => t !== tag);

    setConfig((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        source: newSources.join(","),
      },
    }));
  };

  // Atualiza as regras
  const handleRulesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setConfig((prev) => ({
      ...prev,
      [fieldKey]: {
        source: prev[fieldKey]?.source || "",
        rules: value || "",
      },
    }));
  };

  const assignedTags = fieldMapping.source
    ? fieldMapping.source
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="border p-3 rounded" ref={dropRef as (node: HTMLDivElement | null) => void}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold capitalize">{fieldKey}</h3>
      </div>

      {/* Área de dropzone */}
      <div
        className={`min-h-[40px] flex flex-wrap gap-2 p-2 border rounded ${isOver ? "bg-blue-50" : "bg-white"}`}
      >
        {assignedTags.length === 0 ? (
          <span className="text-gray-400 text-sm">Arraste tags aqui</span>
        ) : (
          assignedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex border bg-green-200 text-green-800 text-xs px-2 py-1 rounded"
            >
              {tag}
              <button className="ml-1 font-bold text-red-600" onClick={() => handleRemoveTag(tag)}>
                ×
              </button>
            </span>
          ))
        )}
      </div>

      {/* Campo de regras */}
      <label className="block mt-2 text-sm font-medium text-gray-700">Regras adicionais:</label>
      <textarea
        className="block w-full rounded border p-2 text-sm"
        rows={2}
        placeholder="Instruções de mapeamento"
        value={fieldMapping.rules || ""}
        onChange={handleRulesChange}
      />
    </div>
  );
}
