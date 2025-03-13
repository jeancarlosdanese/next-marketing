// File: types/template.ts

export type Template = {
  id: string;
  name: string;
  description?: string;
  channel: "email" | "whatsapp";
  has_file?: boolean;
  content?: string; // added content property
  created_at: string;
  updated_at: string;
};
