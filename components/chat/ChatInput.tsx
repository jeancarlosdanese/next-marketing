import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { useRef } from "react";

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  onIA: () => void;
  disabled?: boolean;
  className?: string;
}

export default function ChatInput({ value, onChange, onSend, onIA, disabled, className }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled) onSend();
  };

  return (
    <form
      onSubmit={handleSubmit}
      ref={formRef}
      className={`flex w-full bg-muted px-2 py-2 border-t ${className}`}
    >
      <Textarea
        placeholder="Digite a resposta..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 resize-none min-h-[84px] rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary"
        rows={3}
      />

      <div className="flex flex-col justify-between pl-2">
        <Button type="button" onClick={onIA} variant="ghost" size="icon" title="Gerar com IA">
          <Sparkles className="w-5 h-5" />
        </Button>

        <Button type="submit" disabled={disabled} variant="default" size="icon" title="Enviar">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}
