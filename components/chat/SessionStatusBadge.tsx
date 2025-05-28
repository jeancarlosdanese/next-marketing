// components/chat/SessionStatusBadge.tsx

import { getValidSessionStatusKey, sessionStatusIcons } from "@/utils/sessionStatusIcons";
import { Badge } from "@/components/ui/badge";

interface Props {
  status?: string;
  className?: string;
}

export default function SessionStatusBadge({ status, className = "" }: Props) {
  const statusKey = getValidSessionStatusKey(status);
  const { icon: StatusIcon, label, color } = sessionStatusIcons[statusKey];

  return (
    <Badge variant="outline" className={`flex items-center gap-2 text-sm px-3 py-1 ${className}`}>
      <StatusIcon className={`w-4 h-4 ${color}`} />
      <span className={`font-medium ${color}`}>{label}</span>
    </Badge>
  );
}
