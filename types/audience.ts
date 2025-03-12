// File: type/audience.ts

export type Audience = {
  id: string;
  campaign_id: string;
  contact_id: string;
  type: "email" | "whatsapp";
  status:
    | "pendente"
    | "fila"
    | "falha_envio"
    | "enviado"
    | "entregue"
    | "falha_renderizacao"
    | "rejeitado"
    | "devolvido"
    | "reclamado"
    | "atrasado"
    | "atualizou_assinatura";
  name: string;
  email: string;
  whatsapp: string;
  gender: "masculino" | "feminino" | "outro";
  birth_date: string;
  bairro: string;
  cidade: string;
  estado: string;
};
