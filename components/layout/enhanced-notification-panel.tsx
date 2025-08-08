"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useSafeFirebaseData } from "@/hooks/use-safe-firebase-data";
import { Alert as FirebaseAlert } from "@/types/device";

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  deviceId?: string;
  deviceName?: string;
  isRead: boolean;
  priority: number;
}

interface NotificationSettings {
  soundEnabled: boolean;
  volume: number;
  desktopNotifications: boolean;
  emailNotifications: boolean;
  showCriticalOnly: boolean;
}

export function EnhancedNotificationPanel() {
  const { alerts: firebaseAlerts, acknowledgeAlert } = useSafeFirebaseData();
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    soundEnabled: true,
    volume: 75,
    desktopNotifications: true,
    emailNotifications: false,
    showCriticalOnly: false
  });

  // Convert Firebase alerts to local alerts format
  useEffect(() => {
    const convertedAlerts: Alert[] = firebaseAlerts.map((alert: FirebaseAlert) => {
      // Determine alert type based on Firebase alert type
      let type: 'critical' | 'warning' | 'info' = 'info';
      let priority = 3;
      
      if (alert.type === 'temperature' || alert.type === 'location') {
        type = 'critical';
        priority = 1;
      } else if (alert.type === 'humidity' || alert.type === 'windSpeed') {
        type = 'warning';
        priority = 2;
      }
      
      return {
        id: alert.id,
        type,
        title: `${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert`,
        message: alert.message,
        timestamp: alert.createdAt,
        deviceId: alert.deviceId,
        deviceName: alert.deviceName,
        isRead: alert.acknowledged,
        priority
      };
    });
    
    setAlerts(convertedAlerts);
  }, [firebaseAlerts]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse notification settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('notificationSettings', JSON.stringify(updated));
  };

  // Get unread alerts count
  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.type === 'critical' && !alert.isRead).length;

  // Filter alerts based on settings
  const filteredAlerts = settings.showCriticalOnly 
    ? alerts.filter(alert => alert.type === 'critical')
    : alerts;

  // Sort alerts by priority and timestamp
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId);
      toast({
        title: "Alert Acknowledged! ✅",
        description: "The alert has been marked as acknowledged",
      });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast({
        title: "Error",
        description: "Failed to acknowledge alert. Please try again.",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      // Acknowledge all unread alerts
      const unreadAlerts = alerts.filter(alert => !alert.isRead);
      for (const alert of unreadAlerts) {
        await acknowledgeAlert(alert.id);
      }
      
      toast({
        title: "All Alerts Marked as Read! ✅",
        description: "All notifications have been marked as read",
      });
    } catch (error) {
      console.error('Error acknowledging all alerts:', error);
      toast({
        title: "Error",
        description: "Failed to acknowledge all alerts. Please try again.",
        variant: "destructive"
      });
    }
  };

  const clearAllAlerts = async () => {
    // Note: We don't actually delete alerts from Firebase, just hide them by acknowledging
    try {
      const unacknowledgedAlerts = alerts.filter(alert => !alert.isRead);
      for (const alert of unacknowledgedAlerts) {
        await acknowledgeAlert(alert.id);
      }
      
      toast({
        title: "All Alerts Cleared! 🗑️",
        description: "All notifications have been acknowledged",
      });
    } catch (error) {
      console.error('Error clearing alerts:', error);
      toast({
        title: "Error",
        description: "Failed to clear alerts. Please try again.",
        variant: "destructive"
      });
    }
  };

  const testSound = () => {
    if (settings.soundEnabled) {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(settings.volume / 100 * 0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      toast({
        title: "Sound Test! 🔊",
        description: `Volume: ${settings.volume}%`,
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updateSettings({ desktopNotifications: true });
        toast({
          title: "Desktop Notifications Enabled! 🔔",
          description: "You'll now receive desktop notifications for alerts",
        });
      }
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="transition-all duration-200 hover:scale-110 hover:bg-gray-100 text-gray-600 hover:text-gray-900 relative"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m5 0v5" />
        </svg>
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 flex items-center justify-center">
            <div className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          </div>
        )}
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
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m5 0v5" />
                  </svg>
                </div>
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {unreadCount} new
                  </Badge>
                )}
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
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-lg font-bold text-red-600">{criticalCount}</div>
                    <div className="text-xs text-red-600">Critical</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-lg font-bold text-yellow-600">
                      {alerts.filter(a => a.type === 'warning' && !a.isRead).length}
                    </div>
                    <div className="text-xs text-yellow-600">Warning</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-600">
                      {alerts.filter(a => a.type === 'info' && !a.isRead).length}
                    </div>
                    <div className="text-xs text-blue-600">Info</div>
                  </div>
                </div>

                {/* Settings Panel */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">🔧 Settings</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Sound Alerts</span>
                      <Switch
                        checked={settings.soundEnabled}
                        onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                      />
                    </div>

                    {settings.soundEnabled && (
                      <div className="ml-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Volume</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600">{settings.volume}%</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={testSound}
                              className="h-6 px-2 text-xs"
                            >
                              🔊 Test
                            </Button>
                          </div>
                        </div>
                        <Slider
                          value={[settings.volume]}
                          onValueChange={(value) => updateSettings({ volume: value[0] })}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Desktop Notifications</span>
                      <Switch
                        checked={settings.desktopNotifications}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            requestNotificationPermission();
                          } else {
                            updateSettings({ desktopNotifications: false });
                          }
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Email Notifications</span>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => updateSettings({ emailNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Critical Only</span>
                      <Switch
                        checked={settings.showCriticalOnly}
                        onCheckedChange={(checked) => updateSettings({ showCriticalOnly: checked })}
                      />
                    </div>
                  </div>
                </div>

                {/* Bulk Actions */}
                {unreadCount > 0 && (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={markAllAsRead}
                      className="flex-1 transition-all duration-200 hover:scale-105"
                    >
                      ✅ Mark All Read ({unreadCount})
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={clearAllAlerts}
                      className="flex-1 transition-all duration-200 hover:scale-105"
                    >
                      🗑️ Clear All
                    </Button>
                  </div>
                )}

                <Separator className="bg-gray-200" />

                {/* Active Alerts */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-900">
                    🚨 Active Alerts ({sortedAlerts.filter(a => !a.isRead).length})
                  </h4>
                  <div className="space-y-2">
                    {sortedAlerts.filter(alert => !alert.isRead).length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <div className="text-2xl mb-2">🎉</div>
                        <p className="text-sm">No active alerts!</p>
                        <p className="text-xs opacity-75">All systems are running normally</p>
                      </div>
                    ) : (
                      sortedAlerts
                        .filter(alert => !alert.isRead)
                        .map((alert) => (
                          <div
                            key={alert.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${getAlertColor(alert.type)}`}
                            onClick={() => markAsRead(alert.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-2 flex-1">
                                <span className="text-lg">{getAlertIcon(alert.type)}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-medium text-sm truncate">{alert.title}</h5>
                                    <span className="text-xs opacity-75 ml-2 flex-shrink-0">
                                      {formatTimeAgo(alert.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-xs mt-1 opacity-90">{alert.message}</p>
                                  {alert.deviceName && (
                                    <div className="flex items-center mt-2">
                                      <Badge variant="outline" className="text-xs">
                                        📱 {alert.deviceName}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Resolved Alerts */}
                {sortedAlerts.filter(alert => alert.isRead).length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-900">
                      ✅ Resolved ({sortedAlerts.filter(a => a.isRead).length})
                    </h4>
                    <div className="space-y-2">
                      {sortedAlerts
                        .filter(alert => alert.isRead)
                        .slice(0, 3)
                        .map((alert) => (
                          <div
                            key={alert.id}
                            className="p-2 rounded-lg bg-gray-50 border border-gray-200 opacity-75"
                          >
                            <div className="flex items-start space-x-2">
                              <span className="text-sm opacity-50">{getAlertIcon(alert.type)}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-medium text-xs text-gray-600 truncate">{alert.title}</h5>
                                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                    {formatTimeAgo(alert.timestamp)}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{alert.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      {sortedAlerts.filter(alert => alert.isRead).length > 3 && (
                        <div className="text-center">
                          <Button variant="ghost" size="sm" className="text-xs">
                            View {sortedAlerts.filter(alert => alert.isRead).length - 3} more...
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Separator className="bg-gray-200" />

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 space-y-1">
                  <p>Real-time monitoring active</p>
                  <p>Last updated: {new Date().toLocaleTimeString()}</p>
                </div>
              </CardContent>
            </ScrollArea>
          </Card>
        </>
      )}
    </div>
  );
}
