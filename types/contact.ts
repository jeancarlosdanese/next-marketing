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

export type ContactList = {
  id?: string; // Gerenciado pelo backend
  name: string;
  email?: string;
  whatsapp?: string;
  gender?: "masculino" | "feminino" | "outro";
  birth_date?: string; // YYYY-MM-DD
  bairro?: string;
  cidade?: string;
  estado?: string;
  last_contact_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

// Define a estrutura que recebemos do backend (simplificada)
export interface FieldMapping {
  source: string; // Ex: "email" ou "email,fone_celular" ou "todos_os_campos"
  rules: string; // Armazena as regras personalizadas
}

export interface ContactImportConfig {
  about_data: FieldMapping;
  name: FieldMapping;
  email: FieldMapping;
  whatsapp: FieldMapping;
  gender: FieldMapping;
  birth_date: FieldMapping;
  bairro: FieldMapping;
  cidade: FieldMapping;
  estado: FieldMapping;
  interesses: FieldMapping;
  perfil: FieldMapping;
  eventos: FieldMapping;
  history: FieldMapping;
  last_contact_at: FieldMapping;

  [key: string]: {
    source: string;
    rules: string;
  };
}
