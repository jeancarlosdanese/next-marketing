// utils/sessionStatusIcons.tsx

import { CheckCircle, Clock, XCircle, RefreshCw, AlertTriangle, HelpCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type SessionStatus =
  | "conectado"
  | "aguardando_qr"
  | "qrcode_expirado"
  | "desconectado"
  | "erro"
  | "desconhecido";

export const sessionStatusIcons: Record<
  SessionStatus,
  {
    icon: LucideIcon;
    label: string;
    color: string;
  }
> = {
  conectado: { icon: CheckCircle, label: "Conectado", color: "text-green-600" },
  aguardando_qr: { icon: Clock, label: "QR aguardando", color: "text-yellow-500" },
  qrcode_expirado: { icon: Clock, label: "QR expirado", color: "text-orange-500" },
  desconectado: { icon: XCircle, label: "Desconectado", color: "text-gray-500" },
  erro: { icon: AlertTriangle, label: "Erro", color: "text-red-600" },
  desconhecido: { icon: HelpCircle, label: "Desconhecido", color: "text-muted-foreground" },
};

export function getValidSessionStatusKey(status: string | undefined): SessionStatus {
  const validStatuses: SessionStatus[] = [
    "desconhecido",
    "conectado",
    "aguardando_qr",
    "qrcode_expirado",
    "desconectado",
    "erro",
  ];

  return validStatuses.includes(status as SessionStatus)
    ? (status as SessionStatus)
    : "desconhecido";
}
