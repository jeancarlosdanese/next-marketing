// components/chat/ChatAISuggestion.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Props {
  sugestao: string;
  onEnviar: (texto: string) => void;
  onIgnorar: () => void;
}

export default function ChatAISuggestion({ sugestao, onEnviar, onIgnorar }: Props) {
  const [texto, setTexto] = useState(sugestao);

  return (
    <Card className="bg-yellow-100 dark:bg-yellow-200 border-yellow-300 text-zinc-900">
      <CardContent className="p-4">
        <p className="text-sm font-medium mb-2">🤖 Sugestão da IA:</p>
        <Textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="w-full min-h-[120px] text-sm"
        />
        <div className="flex gap-2 mt-4">
          <Button size="sm" onClick={() => onEnviar(texto)}>
            Enviar
          </Button>
          <Button size="sm" variant="secondary" onClick={onIgnorar}>
            Ignorar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
