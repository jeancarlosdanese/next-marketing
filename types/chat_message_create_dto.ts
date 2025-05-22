// types/chat_message_create_dto.ts

export interface ChatMessageCreateDTO {
  actor: "cliente" | "atendente" | "ai";
  type: "texto" | "audio" | "imagem" | "video" | "documento";
  content?: string; // opcional se for um arquivo
  file_url?: string; // obrigatório se type !== "texto"
}
