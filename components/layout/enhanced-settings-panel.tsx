"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface SystemSettings {
  language: string;
  notifications: {
    enabled: boolean;
    sound: boolean;
    volume: number;
    desktop: boolean;
    email: boolean;
    alarmSound: boolean; // Add alarm sound toggle
  };
  dataRetention: number; // days
  refreshRate: number; // seconds
  units: {
    temperature: 'celsius' | 'fahrenheit';
    windSpeed: 'kmh' | 'mph' | 'ms';
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    exportFormat: 'json' | 'csv' | 'xml';
  };
  security: {
    sessionTimeout: number; // minutes
    twoFactorAuth: boolean;
    loginNotifications: boolean;
  };
}

const defaultSettings: SystemSettings = {
  language: 'en',
  notifications: {
    enabled: true,
    sound: true,
    volume: 75,
    desktop: true,
    email: false,
    alarmSound: true // Add default value for alarm sound
  },
  dataRetention: 30,
  refreshRate: 5,
  units: {
    temperature: 'celsius',
    windSpeed: 'kmh',
    dateFormat: 'DD/MM/YYYY'
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'weekly',
    exportFormat: 'json'
  },
  security: {
    sessionTimeout: 60,
    twoFactorAuth: false,
    loginNotifications: true
  }
};

export function EnhancedSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Update settings and mark as changed
  const updateSettings = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newSettings;
    });
    setHasUnsavedChanges(true);
  };

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    setHasUnsavedChanges(false);
    
    toast({
      title: "Settings Saved! ✅",
      description: "Your preferences have been updated successfully",
    });
  };

  // Reset to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasUnsavedChanges(true);
    toast({
      title: "Settings Reset! 🔄",
      description: "All settings have been restored to defaults",
    });
  };

  // Export settings
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monitoring-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Settings Exported! 📁",
      description: "Settings file has been downloaded",
    });
  };

  // Import settings
  const importSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const imported = JSON.parse(e.target?.result as string);
            setSettings({ ...defaultSettings, ...imported });
            setHasUnsavedChanges(true);
            toast({
              title: "Settings Imported! 📥",
              description: "Settings have been loaded from file",
            });
          } catch (error) {
            toast({
              title: "Import Failed! ❌",
              description: "Invalid settings file format",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {hasUnsavedChanges && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
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
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span>Settings</span>
                {hasUnsavedChanges && (
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                    Unsaved
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
                {/* Quick Actions */}
                {hasUnsavedChanges && (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={saveSettings}
                      className="flex-1 transition-all duration-200 hover:scale-105"
                    >
                      💾 Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={resetSettings}
                      className="flex-1 transition-all duration-200 hover:scale-105"
                    >
                      🔄 Reset
                    </Button>
                  </div>
                )}

                {/* Language Settings */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">
                    🌐 Language & Region
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-700">
                        Language
                      </label>
                      <Select 
                        value={settings.language} 
                        onValueChange={(value) => updateSettings('language', value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="es">🇪🇸 Español</SelectItem>
                          <SelectItem value="fr">🇫🇷 Français</SelectItem>
                          <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                          <SelectItem value="zh">🇨🇳 中文</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">
                    🔔 Notifications
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Enable Notifications
                      </span>
                      <Switch
                        checked={settings.notifications.enabled}
                        onCheckedChange={(checked) => updateSettings('notifications.enabled', checked)}
                      />
                    </div>

                    {settings.notifications.enabled && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Sound Alerts
                          </span>
                          <Switch
                            checked={settings.notifications.sound}
                            onCheckedChange={(checked) => updateSettings('notifications.sound', checked)}
                          />
                        </div>

                        {settings.notifications.sound && (
                          <div className="ml-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-600">
                                Volume
                              </span>
                              <span className="text-xs text-gray-600">
                                {settings.notifications.volume}%
                              </span>
                            </div>
                            <Slider
                              value={[settings.notifications.volume]}
                              onValueChange={(value) => updateSettings('notifications.volume', value[0])}
                              max={100}
                              step={5}
                              className="w-full"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Desktop Notifications
                          </span>
                          <Switch
                            checked={settings.notifications.desktop}
                            onCheckedChange={(checked) => updateSettings('notifications.desktop', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Email Notifications
                          </span>
                          <Switch
                            checked={settings.notifications.email}
                            onCheckedChange={(checked) => updateSettings('notifications.email', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            Alarm Sound
                          </span>
                          <Switch
                            checked={settings.notifications.alarmSound}
                            onCheckedChange={(checked) => updateSettings('notifications.alarmSound', checked)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Data Management */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">
                    📊 Data Management
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">
                          Data Retention
                        </span>
                        <span className="text-sm text-gray-600">
                          {settings.dataRetention} days
                        </span>
                      </div>
                      <Slider
                        value={[settings.dataRetention]}
                        onValueChange={(value) => updateSettings('dataRetention', value[0])}
                        min={7}
                        max={365}
                        step={7}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">
                          Refresh Rate
                        </span>
                        <span className="text-sm text-gray-600">
                          {settings.refreshRate}s
                        </span>
                      </div>
                      <Slider
                        value={[settings.refreshRate]}
                        onValueChange={(value) => updateSettings('refreshRate', value[0])}
                        min={1}
                        max={60}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Units Configuration */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">
                    📏 Units & Formats
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-700">
                        Temperature
                      </label>
                      <Select 
                        value={settings.units.temperature} 
                        onValueChange={(value: 'celsius' | 'fahrenheit') => updateSettings('units.temperature', value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="celsius">🌡️ Celsius (°C)</SelectItem>
                          <SelectItem value="fahrenheit">🌡️ Fahrenheit (°F)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-700">
                        Wind Speed
                      </label>
                      <Select 
                        value={settings.units.windSpeed} 
                        onValueChange={(value: 'kmh' | 'mph' | 'ms') => updateSettings('units.windSpeed', value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kmh">💨 km/h</SelectItem>
                          <SelectItem value="mph">💨 mph</SelectItem>
                          <SelectItem value="ms">💨 m/s</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-700">
                        Date Format
                      </label>
                      <Select 
                        value={settings.units.dateFormat} 
                        onValueChange={(value: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD') => updateSettings('units.dateFormat', value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">📅 DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">📅 MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">📅 YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Backup & Export */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">
                    💾 Backup & Export
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Auto Backup
                      </span>
                      <Switch
                        checked={settings.backup.autoBackup}
                        onCheckedChange={(checked) => updateSettings('backup.autoBackup', checked)}
                      />
                    </div>

                    {settings.backup.autoBackup && (
                      <div>
                        <label className="text-sm text-gray-700">
                          Backup Frequency
                        </label>
                        <Select 
                          value={settings.backup.backupFrequency} 
                          onValueChange={(value: 'daily' | 'weekly' | 'monthly') => updateSettings('backup.backupFrequency', value)}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">📅 Daily</SelectItem>
                            <SelectItem value="weekly">📅 Weekly</SelectItem>
                            <SelectItem value="monthly">📅 Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <label className="text-sm text-gray-700">
                        Export Format
                      </label>
                      <Select 
                        value={settings.backup.exportFormat} 
                        onValueChange={(value: 'json' | 'csv' | 'xml') => updateSettings('backup.exportFormat', value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">📄 JSON</SelectItem>
                          <SelectItem value="csv">📊 CSV</SelectItem>
                          <SelectItem value="xml">📋 XML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={exportSettings}
                        className="flex-1 transition-all duration-200 hover:scale-105"
                      >
                        📁 Export
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={importSettings}
                        className="flex-1 transition-all duration-200 hover:scale-105"
                      >
                        📥 Import
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">
                    🔒 Security
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">
                          Session Timeout
                        </span>
                        <span className="text-sm text-gray-600">
                          {settings.security.sessionTimeout} min
                        </span>
                      </div>
                      <Slider
                        value={[settings.security.sessionTimeout]}
                        onValueChange={(value) => updateSettings('security.sessionTimeout', value[0])}
                        min={15}
                        max={480}
                        step={15}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Two-Factor Authentication
                      </span>
                      <Switch
                        checked={settings.security.twoFactorAuth}
                        onCheckedChange={(checked) => updateSettings('security.twoFactorAuth', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        Login Notifications
                      </span>
                      <Switch
                        checked={settings.security.loginNotifications}
                        onCheckedChange={(checked) => updateSettings('security.loginNotifications', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 space-y-2">
                  <p>Settings are automatically saved locally</p>
                  <p>Version 1.0.0 • Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </CardContent>
            </ScrollArea>
          </Card>
        </>
      )}
    </div>
  );
}
