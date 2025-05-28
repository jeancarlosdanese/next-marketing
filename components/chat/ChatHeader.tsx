// File: components/chat/ChatHeader.tsx

import { Chat } from "@/types/chats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getValidSessionStatusKey, sessionStatusIcons } from "@/utils/sessionStatusIcons";

interface Props {
  chats: Chat[];
  selected: Chat | null;
  onSelect: (chat: Chat) => void;
}

export default function ChatHeader({ chats, selected, onSelect }: Props) {
  const statusKey = getValidSessionStatusKey(selected?.session_status);
  const { icon: StatusIcon, label, color } = sessionStatusIcons[statusKey];

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 border-b bg-background">
      {/* Título */}
      <div className="flex items-center gap-2 text-lg font-semibold">
        🤖 Atendimento Inteligente
      </div>

      {/* Seletor + status */}
      <div className="flex items-center gap-2">
        <Select
          value={selected?.id || ""}
          onValueChange={(id) => {
            const novo = chats.find((c) => c.id === id);
            if (novo) onSelect(novo);
          }}
        >
          <SelectTrigger className="w-[180px] sm:w-64">
            <SelectValue placeholder="Selecione o setor" />
          </SelectTrigger>
          <SelectContent>
            {chats.map((chat) => (
              <SelectItem key={chat.id} value={chat.id}>
                {chat.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <div className="flex items-center gap-1 text-sm">
          <StatusIcon className={`w-4 h-4 ${color}`} />
          <span className={color}>{label}</span>
        </div>
      </div>
    </div>
  );
}
