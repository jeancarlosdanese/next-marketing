// components/chat/ChatAISuggestion.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  sugestao: string;
  onEnviar: () => void;
  onEditar: () => void;
  onIgnorar: () => void;
}

export default function ChatAISuggestion({ sugestao, onEnviar, onEditar, onIgnorar }: Props) {
  return (
    <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-100">
      <CardContent className="p-4">
        <p className="text-sm text-yellow-900 mb-2">🤖 Sugestão da IA:</p>
        <p className="whitespace-pre-line text-sm">{sugestao}</p>
        <div className="flex gap-2 mt-4">
          <Button size="sm" onClick={onEnviar}>
            Enviar
          </Button>
          <Button size="sm" variant="secondary" onClick={onEditar}>
            Editar
          </Button>
          <Button size="sm" variant="secondary" onClick={onIgnorar}>
            Ignorar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
