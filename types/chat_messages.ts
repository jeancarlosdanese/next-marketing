// types/chat_messages.ts

export interface ChatMessage {
  id: string;
  chat_contact_id: string;
  actor: "cliente" | "atendente" | "ai";
  type: "texto" | "audio" | "imagem" | "video" | "documento";
  content: string | null; // texto gerado ou transcrição
  file_url?: string | null; // se aplicável (áudio, PDF, etc.)
  source_processed: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
