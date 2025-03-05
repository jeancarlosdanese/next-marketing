// File: types/campaign.ts

export type Campaign = {
  id: string;
  name: string;
  description?: string;
  channels: Record<string, { template: string; priority: number }>;
  filters: {
    tags: string[];
    gender?: string;
    birth_date_range?: {
      start: string;
      end: string;
    };
  };
  status: "pendente" | "ativa" | "concluida";
  created_at: string;
  updated_at: string;
};
