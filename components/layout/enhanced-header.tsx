"use client";

import { EnhancedNotificationPanel } from "./enhanced-notification-panel";
import { EnhancedSettingsPanel } from "./enhanced-settings-panel";
import { EnhancedProfilePanel } from "./enhanced-profile-panel";
import { EnhancedConnectionStatus } from "@/components/ui/enhanced-connection-status";
import { Badge } from "@/components/ui/badge";

export function EnhancedHeader() {
  return (
    <header className="h-16 border-b bg-white border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Sites Monitoring Portal
          </h2>
        </div>
        <EnhancedConnectionStatus />
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
          🔄 Auto-refresh: 5s
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        <EnhancedNotificationPanel />
        <EnhancedSettingsPanel />
        <EnhancedProfilePanel />
      </div>
    </header>
  );
}
