// types/chats.ts

import { SessionStatus } from "@/utils/sessionStatusIcons";

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
  session_status?: string;
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

export type SessionStatusDTO = {
  status: SessionStatus;
  connected: boolean;
  qrCodeAvailable: boolean;
  qrCode?: string | null;
  message: string;
};
