// services/chat_contact.ts

export interface ChatContactFull {
  id: string;
  chat_id: string;
  contact_id: string;
  whatsapp_contact_id: string;
  name: string;
  phone: string;
  jid: string;
  is_business: boolean;
  status: "aberto" | "fechado" | "pendente";
  updated_at: string; // ISO timestamp
}
