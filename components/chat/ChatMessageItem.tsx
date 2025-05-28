// compontents/chat/ChatMessageItem.tsx

import { ChatMessage } from "@/types/chat_messages";
import { cn } from "@/lib/utils";
import { User, Bot, Smile } from "lucide-react";
import { ChatBubble } from "./ChatBubble";

export default function ChatMessageItem({ msg }: { msg: ChatMessage }) {
  const isAtendente = msg.actor === "atendente";
  const isAI = msg.actor === "ai";

  const alignment = isAtendente ? "justify-end" : "justify-start";
  const layout = isAtendente ? "flex-row-reverse" : "flex-row";
  const Icon = isAI ? Bot : isAtendente ? User : Smile;

  return (
    <div className={cn("flex mb-3", alignment)}>
      <div className={cn("flex items-end gap-2", layout)}>
        {/* Ícone + hora empilhados */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-muted text-muted-foreground border border-border">
            <Icon className="w-4 h-4" />
          </div>
          <div className="text-[10px] text-muted-foreground">
            {new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Bolha de mensagem */}
        <ChatBubble text={msg.content ?? ""} isOwner={isAtendente} />
      </div>
    </div>
  );
}
