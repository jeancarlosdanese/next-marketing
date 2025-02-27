// File: types/template.ts

export type Template = {
    id: string;
    name: string;
    description?: string;
    channel: "email" | "whatsapp";
    created_at: string;
    updated_at: string;
  };
  