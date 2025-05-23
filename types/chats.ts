// types/chats.ts

export interface Chat {
  id: string;
  account_id: string;
  department: "comercial" | "financeiro" | "suporte"; // pode estender
  title: string;
  instructions: string;
  phone_number: string;
  evolution_instance: string;
  webhook_url: string;
  status: "ativo" | "inativo";
  created_at: string;
  updated_at: string;
}

export interface ChatCreateDTO {
  department: string;
  title: string;
  instructions: string;
  phone_number: string;
  evolution_instance: string;
  webhook_url: string;
}
