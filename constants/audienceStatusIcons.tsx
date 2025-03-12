// File: constants/audienceStatusIcons.tsx

import { Clock, ListChecks, CheckCircle, XCircle } from "lucide-react";

export const audienceStatusIcons = {
  pendente: { icon: <Clock className="w-5 h-5 text-yellow-500" />, label: "Pendente" },
  fila: { icon: <ListChecks className="w-5 h-5 text-blue-500" />, label: "Na Fila" },
  falha_envio: { icon: <XCircle className="w-5 h-5 text-red-500" />, label: "Falha no Envio" },
  enviado: { icon: <CheckCircle className="w-5 h-5 text-green-600" />, label: "Enviado" },
  entregue: { icon: <CheckCircle className="w-5 h-5 text-green-600" />, label: "Entregue" },
  falha_renderizacao: {
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    label: "Falha na Renderização",
  },
  rejeitado: { icon: <XCircle className="w-5 h-5 text-red-500" />, label: "Rejeitado" },
  devolvido: { icon: <XCircle className="w-5 h-5 text-red-500" />, label: "Devolvido" },
  reclamado: { icon: <XCircle className="w-5 h-5 text-red-500" />, label: "Reclamado" },
  atrasado: { icon: <Clock className="w-5 h-5 text-orange-500" />, label: "Atrasado" },
  atualizou_assinatura: {
    icon: <XCircle className="w-5 h-5 text-gray-500" />,
    label: "Atualizou Assinatura",
  },
};
