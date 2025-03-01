// File: type/audience.ts

export type Audience = {
  id: string;
  campaign_id: string;
  contact_id: string;
  type: "email" | "whatsapp";
  status: "pendente" | "enviado" | "erro";
  name: string;
  email: string;
  whatsapp: string;
  gender: "masculino" | "feminino" | "outro";
  birth_date: string;
  bairro: string;
  cidade: string;
  estado: string;
};
