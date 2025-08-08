"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

interface UserStats {
  sessionTime: number;
  actionsToday: number;
  alertsHandled: number;
  devicesManaged: number;
  loginStreak: number;
  totalSessions: number;
}

export function EnhancedProfilePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [sessionStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [stats, setStats] = useState<UserStats>({
    sessionTime: 0,
    actionsToday: 12,
    alertsHandled: 8,
    devicesManaged: 4,
    loginStreak: 7,
    totalSessions: 156
  });

  // Update session time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
      setStats(prev => ({
        ...prev,
        sessionTime: Math.floor((Date.now() - sessionStartTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const formatSessionTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: `${action} Opened! 🚀`,
      description: `Redirecting to ${action.toLowerCase()}...`,
    });
    
    // Simulate navigation
    setTimeout(() => {
      switch (action) {
        case 'Account Settings':
          // Navigate to account settings
          break;
        case 'Security':
          // Navigate to security settings
          break;
        case 'Activity Log':
          // Navigate to activity log
          break;
        case 'Help & Support':
          // Navigate to help
          break;
      }
    }, 1000);
  };

  const handleLogout = () => {
    toast({
      title: "Logging Out... 👋",
      description: "See you next time!",
    });
    setTimeout(() => {
      logout();
    }, 1000);
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="transition-all duration-200 hover:scale-110 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[2000]"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-12 w-96 max-h-[600px] z-[2001] shadow-2xl border-0 bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-gray-200">
              <CardTitle className="text-sm font-semibold flex items-center space-x-2 text-gray-900">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span>Profile</span>
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </CardHeader>
            
            <ScrollArea className="h-[500px]">
              <CardContent className="p-4 space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-16 w-16 ring-2 ring-blue-500 ring-offset-2">
                    <AvatarImage src="/diverse-user-avatars.png" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-lg">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-gray-900">
                      {user?.name || 'John Doe'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user?.email || 'admin@company.com'}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        🟢 Administrator
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        High Activity
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* Session Stats */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">
                    Session Overview
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatSessionTime(stats.sessionTime)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Session Time
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.actionsToday}
                      </p>
                      <p className="text-xs text-gray-500">
                        Actions Today
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.alertsHandled}
                      </p>
                      <p className="text-xs text-gray-500">
                        Alerts Handled
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.devicesManaged}
                      </p>
                      <p className="text-xs text-gray-500">
                        Devices Managed
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        Activity Level
                      </span>
                      <span className="text-xs font-medium text-green-600">
                        High
                      </span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* Quick Actions */}
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold mb-2 text-gray-900">
                    Quick Actions
                  </h4>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start transition-all duration-200 hover:scale-105 hover:bg-gray-100 text-gray-700 hover:text-gray-900" 
                    size="sm"
                    onClick={() => handleQuickAction('Account Settings')}
                  >
                    <div className="w-5 h-5 mr-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    Account Settings
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start transition-all duration-200 hover:scale-105 hover:bg-gray-100 text-gray-700 hover:text-gray-900" 
                    size="sm"
                    onClick={() => handleQuickAction('Security')}
                  >
                    <div className="w-5 h-5 mr-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    Security Settings
                  </Button>

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start transition-all duration-200 hover:scale-105 hover:bg-gray-100 text-gray-700 hover:text-gray-900" 
                    size="sm"
                    onClick={() => handleQuickAction('Activity Log')}
                  >
                    <div className="w-5 h-5 mr-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    View Activity Log
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start transition-all duration-200 hover:scale-105 hover:bg-gray-100 text-gray-700 hover:text-gray-900" 
                    size="sm"
                    onClick={() => handleQuickAction('Help & Support')}
                  >
                    <div className="w-5 h-5 mr-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Help & Support
                  </Button>

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start transition-all duration-200 hover:scale-105 text-red-600 hover:text-red-700 hover:bg-red-50" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    <div className="w-5 h-5 mr-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    Sign Out
                  </Button>
                </div>

                <Separator className="bg-gray-200" />

                {/* Footer Info */}
                <div className="text-center text-xs text-gray-400 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Last login:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total logins:</span>
                    <span>{stats.totalSessions}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p>Sites Monitoring Portal v1.0.0</p>
                    <p className="mt-1">© 2025 All rights reserved</p>
                  </div>
                </div>
              </CardContent>
            </ScrollArea>
          </Card>
        </>
      )}
    </div>
  );
}
