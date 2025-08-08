"use client";

import { Badge } from "@/components/ui/badge";
import { useSafeFirebaseData } from "@/hooks/use-safe-firebase-data";

export function EnhancedConnectionStatus() {
  const { connectionStatus } = useSafeFirebaseData();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: '🟢',
          text: 'Firebase Connected',
          className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
        };
      case 'fallback':
        return {
          icon: '🟡',
          text: 'Demo Mode',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
        };
      default:
        return {
          icon: '🔄',
          text: 'Connecting...',
          className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 transition-all duration-200 cursor-default ${config.className}`}
    >
      <span className={connectionStatus === 'connecting' ? 'animate-spin' : ''}>
        {config.icon}
      </span>
      {config.text}
    </Badge>
  );
}
