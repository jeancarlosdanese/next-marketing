// File: constants/statusIcons.tsx

import { Clock, RefreshCw, Send, CheckCircle, XCircle } from "lucide-react";

export const statusIcons = {
  pendente: { icon: <Clock className="w-4 h-4 text-yellow-600" />, label: "Pendente" },
  processando: {
    icon: <RefreshCw className="w-4 h-4 text-orange-500 animate-spin" />,
    label: "Processando",
  },
  enviando: { icon: <Send className="w-4 h-4 text-blue-500" />, label: "Enviando" },
  concluida: { icon: <CheckCircle className="w-4 h-4 text-green-600" />, label: "Concluída" },
  cancelada: { icon: <XCircle className="w-4 h-4 text-red-600" />, label: "Cancelada" },
};
