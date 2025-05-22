// services/chat_contact_resumo.ts

export interface ChatContactResumo {
  id: string;
  contact_id: string;
  nome: string;
  whatsapp: string;
  status: "aberto" | "pendente" | "fechado";
  atualizado_em: string; // ISO timestamp
}
