import { Badge } from "@/components/ui/badge";
import { formatStatus, getStatusTone } from "@/utils/status";

const statusClasses = {
  success: "border-transparent bg-mint text-ink",

  warning: "border-transparent bg-amber-100 text-amber-900",

  danger: "border-transparent bg-red-100 text-red-800",

  neutral: "border-cloud bg-transparent text-slate",
};

function StatusBadge({ status, tone }) {
  const resolvedTone = tone ?? getStatusTone(status);

  return (
    <Badge variant="outline" className={statusClasses[resolvedTone] ?? statusClasses.neutral}>
      {formatStatus(status)}
    </Badge>
  );
}

export { StatusBadge };
