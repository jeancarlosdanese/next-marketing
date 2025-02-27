// File: types/contact.ts

export type ContactTags = {
  interesses?: string[];
  perfil?: string[];
  eventos?: string[];
};

export type Contact = {
  id?: string; // Gerenciado pelo backend
  name: string;
  email?: string;
  whatsapp?: string;
  gender?: "masculino" | "feminino" | "outro";
  birth_date?: string; // YYYY-MM-DD
  bairro?: string;
  cidade?: string;
  estado?: string;
  tags?: ContactTags;
  history?: string;
  opt_out_at?: string | null;
  last_contact_at?: string | null;
  created_at?: string;
  updated_at?: string;
};
