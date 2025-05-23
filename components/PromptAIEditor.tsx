// File: components/PromptAIEditor.tsx

import React from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export const PromptAIEditor: React.FC<Props> = ({ value, onChange, className }) => {
  const handleEditorChange = (newValue: string | undefined) => {
    if (typeof newValue === "string") {
      onChange(newValue);
    }
  };

  return (
    <div
      className={cn(
        "w-full flex flex-col md:flex-row gap-6",
        "min-h-[250px] md:max-h-[calc(100vh-330px)]", // Altura útil (ajuste conforme header/tabs), só limita no desktop.
        className
      )}
    >
      {/* Editor */}
      <div className="flex-1 flex flex-col rounded-md border bg-[#1e1e1e] text-[#d4d4d4]">
        <p className="text-sm font-semibold p-2 bg-[#111] border-b border-[#2b2b2b]">
          ✍️ Editar Instrução
        </p>
        <div className="flex-1 overflow-auto">
          <MonacoEditor
            language="markdown"
            theme="vs-dark"
            value={value}
            onChange={handleEditorChange}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 flex flex-col rounded-md border bg-muted text-muted-foreground">
        <p className="text-sm font-semibold p-2 border-b">👁️ Pré-visualização</p>
        <div className="prose dark:prose-invert p-4 overflow-auto flex-1 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value || "_Nenhuma instrução definida._"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
