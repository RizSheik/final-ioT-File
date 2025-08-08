"use client";

import { Badge } from "@/components/ui/badge";

export function ConnectionStatus() {
  return (
    <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
      Firebase Connected
    </Badge>
  );
}
