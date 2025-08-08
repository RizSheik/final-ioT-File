import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DeviceStatusBadgeProps {
  status: 'online' | 'offline';
}

export function DeviceStatusBadge({ status }: DeviceStatusBadgeProps) {
  return (
    <Badge
      variant={status === 'online' ? 'default' : 'destructive'}
      className={cn(
        "text-xs",
        status === 'online'
          ? "bg-green-100 text-green-800 hover:bg-green-100"
          : "bg-red-100 text-red-800 hover:bg-red-100"
      )}
    >
      <div className={`inline-block w-2 h-2 rounded-full mr-1 ${status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
