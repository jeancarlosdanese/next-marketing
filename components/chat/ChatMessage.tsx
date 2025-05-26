// components/chat/ChatMessage.tsx

import { ChatMessage } from "@/types/chat_messages";
import { cn } from "@/lib/utils"; // utilitário para concatenar classes condicionalmente

export default function ChatMessageItem({ msg }: { msg: ChatMessage }) {
  const base = "max-w-md rounded-xl p-3 text-sm shadow-sm whitespace-pre-wrap";
  const style = {
    cliente: "bg-background border text-foreground",
    ai: "bg-yellow-100 border border-yellow-300 text-yellow-900 dark:bg-yellow-200 dark:text-yellow-900",
    atendente: "bg-green-100 text-green-900 dark:bg-green-200",
  };

  return (
    <div className={cn(base, style[msg.actor] || "")}>
      <div className="text-xs font-semibold uppercase mb-1">{msg.actor}</div>
      {msg.content}
      <div className="text-[10px] text-right text-muted-foreground mt-1">
        {new Date(msg.created_at).toLocaleTimeString()}
      </div>
    </div>
  );
}
