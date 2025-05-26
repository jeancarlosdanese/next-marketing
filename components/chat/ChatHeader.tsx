// components/chat/ChatHeader.tsx

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sessionStatusIcons, getValidSessionStatusKey } from "@/utils/sessionStatusIcons";
import { Chat } from "@/types/chats";

export default function ChatHeader({
  chats,
  selected,
  onSelect,
}: {
  chats: Chat[];
  selected: Chat | null;
  onSelect: (c: Chat) => void;
}) {
  const statusKey = getValidSessionStatusKey(selected?.session_status);
  const { icon: StatusIcon, label, color } = sessionStatusIcons[statusKey];

  return (
    <div className="flex justify-between items-center border-b px-4 py-2 bg-background">
      <h1 className="font-bold text-lg">🤖 Atendimento Inteligente</h1>
      <div className="flex items-center gap-3">
        <Select
          value={selected?.id || ""}
          onValueChange={(id) => {
            const novo = chats.find((c) => c.id === id);
            if (novo) onSelect(novo);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecione o setor" />
          </SelectTrigger>
          <SelectContent>
            {chats.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 text-sm">
          <StatusIcon className={`w-4 h-4 ${color}`} />
          <span className={color}>{label}</span>
        </div>
      </div>
    </div>
  );
}
