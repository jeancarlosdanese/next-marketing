// components/chat/ChatBubble.tsx

interface ChatBubbleProps {
  text: string;
  isOwner?: boolean;
}

export function ChatBubble({ text, isOwner }: ChatBubbleProps) {
  return (
    <div
      className={`px-4 py-3 text-sm leading-snug font-medium shadow-sm max-w-[70%] 
        ${
          isOwner
            ? "bg-teal-900 text-white rounded-3xl rounded-br-none ml-auto"
            : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 rounded-3xl rounded-bl-none mr-auto"
        }`}
    >
      {text}
    </div>
  );
}
