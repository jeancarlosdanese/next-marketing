// File: components/MappingField.tsx

import React from "react";
import { useDrop } from "react-dnd";
import { ContactImportConfig } from "@/types/contact";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Utilitário para classes condicionais

interface MappingFieldProps {
  fieldKey: keyof ContactImportConfig;
  config: ContactImportConfig;
  setConfig: React.Dispatch<React.SetStateAction<ContactImportConfig>>;
}

const MappingField: React.FC<MappingFieldProps> = ({ fieldKey, config, setConfig }) => {
  const fieldMapping = config[fieldKey] || { source: "", rules: "" };

  // Permite que as tags sejam soltas no campo
  const [{ isOver }, dropRef] = useDrop({
    accept: "CSV_TAG",
    drop: (item: { name: string }) => {
      const newTag = item.name.trim();

      const existingSources = fieldMapping.source
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (!existingSources.includes(newTag)) {
        existingSources.push(newTag);
      }

      setConfig((prev) => ({
        ...prev,
        [fieldKey]: {
          ...prev[fieldKey],
          source: existingSources.join(","),
        },
      }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Função para remover tag
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
    setConfig((prev) => ({
      ...prev,
      [fieldKey]: {
        source: prev[fieldKey]?.source || "",
        rules: e.target.value || "",
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
    <Card
      className={cn(
        "p-3 rounded-md shadow-md transition border",
        isOver ? "border-teal-600 bg-teal-200 dark:bg-teal-900" : "border-border",
        "dark:bg-gray-900 dark:border-gray-900 dark:hover:border-teal-600"
      )}
      ref={dropRef as (node: HTMLDivElement | null) => void}
    >
      <h3 className="text-sm font-semibold capitalize mb-2 text-gray-700 dark:text-gray-300">
        {fieldKey}
      </h3>

      {/* Área de dropzone */}
      <div
        className={cn(
          "min-h-[40px] flex flex-wrap gap-2 p-2 border rounded-md transition",
          isOver
            ? "bg-teal-700 border-teal-800 dark:bg-teal-700"
            : "bg-muted border-border dark:bg-gray-800"
        )}
      >
        {assignedTags.length === 0 ? (
          <span className="text-gray-400 dark:text-gray-500 text-sm">Arraste tags aqui</span>
        ) : (
          assignedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={cn(
                "flex items-center space-x-2 text-white px-2 py-1 text-xs font-semibold shadow-md transition",
                "dark:bg-teal-700 dark:border-teal-800 dark:hover:bg-teal-800 dark:hover:border-teal-900",
                "bg-teal-700 border-teal-800 hover:bg-teal-800 hover:border-teal-900"
              )}
            >
              {tag}
              <button
                className="ml-1 text-white dark:text-gray-200 hover:text-gray-100 dark:hover:text-gray-300 focus:outline-none"
                onClick={() => handleRemoveTag(tag)}
              >
                ×
              </button>
            </Badge>
          ))
        )}
      </div>

      {/* Campo de regras */}
      <label className="block mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        Regras adicionais:
      </label>
      <Textarea
        className="w-full border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-teal-400 focus:border-teal-600"
        rows={2}
        placeholder="Instruções de mapeamento"
        value={fieldMapping.rules || ""}
        onChange={handleRulesChange}
      />
    </Card>
  );
};

export default React.memo(MappingField);
