"use client";

// Theme provider is no longer needed since we removed theme functionality
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
