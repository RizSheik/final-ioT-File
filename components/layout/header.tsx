"use client";

import { NotificationPanel } from "./notification-panel";
import { SettingsPanel } from "./settings-panel";
import { ProfilePanel } from "./profile-panel";
import { ConnectionStatus } from "@/components/ui/connection-status";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">Sites Monitoring Portal</h2>
        <ConnectionStatus />
      </div>
      
      <div className="flex items-center space-x-2">
        <NotificationPanel />
        <SettingsPanel />
        <ProfilePanel />
      </div>
    </header>
  );
}
