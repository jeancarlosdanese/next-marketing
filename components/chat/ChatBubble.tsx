// components/chat/ChatBubble.tsx

import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
  text: string;
  isOwner?: boolean;
}

export function ChatBubble({ text, isOwner }: ChatBubbleProps) {
  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-[70%] px-4 py-3 text-sm leading-snug font-medium shadow-sm
        ${
          isOwner
            ? "bg-teal-900 text-white rounded-3xl rounded-br-none ml-auto"
            : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 rounded-3xl rounded-bl-none mr-auto"
        }`}
    >
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}
