// components/chat/ChatInput.tsx

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  onIA: () => void;
  disabled?: boolean;
}

export default function ChatInput({ value, onChange, onSend, onIA, disabled }: Props) {
  return (
    <div className="border-t p-4 flex gap-2 bg-background">
      <Textarea
        placeholder="Digite a resposta..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <div className="flex flex-col gap-2">
        <Button onClick={onIA} disabled={disabled}>
          <Sparkles className="w-4 h-4 mr-1" /> IA
        </Button>
        <Button onClick={onSend} disabled={disabled}>
          <Send className="w-4 h-4 mr-1" /> Enviar
        </Button>
      </div>
    </div>
  );
}
