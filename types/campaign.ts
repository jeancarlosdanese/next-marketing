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
