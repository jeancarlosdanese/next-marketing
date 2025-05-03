// File: types/campaign.ts

export type Campaign = {
  id: string;
  name: string;
  description?: string;
  channels: Record<string, { template: string; priority: number }>;
  status: "pendente" | "processando" | "enviando" | "concluida" | "cancelada";
  created_at: string;
  updated_at: string;
};

export type Settings = {
  id: string;
  campaign_id: string;
  brand: string;
  subject: string;
  tone?: "formal" | "casual" | "neutro";
  email_from: string;
  email_reply: string;
  email_footer?: string;
  email_instructions: string;
  whatsapp_from: string;
  whatsapp_reply: string;
  whatsapp_footer?: string;
  whatsapp_instructions: string;
  created_at: string; // ou Date, se já estiver convertido
  updated_at: string; // ou Date
};
