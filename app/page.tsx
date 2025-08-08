"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSafeFirebaseData } from "@/hooks/use-safe-firebase-data";
import { useAlertMonitoring } from "@/hooks/use-alert-monitoring";
import { EnhancedDeviceCard } from "@/components/devices/enhanced-device-card";
import { EnhancedDeviceDetailModal } from "@/components/devices/enhanced-device-detail-modal";
import { Device } from "@/types/device";
import { useTheme } from "@/hooks/use-theme";

export default function Dashboard() {
  const { devices, alerts, loading, connectionStatus } = useSafeFirebaseData();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { actualTheme } = useTheme();
  
  // Monitor devices for threshold breaches and generate alerts
  useAlertMonitoring(devices);

  const activeAlerts = alerts.filter(alert => !alert.acknowledged).length;
  const onlineDevices = devices.filter(device => device.status === 'online').length;
  const criticalDevices = devices.filter(device => {
    return device.temperature > device.thresholds.temperature.max ||
           device.temperature < device.thresholds.temperature.min ||
           device.humidity > device.thresholds.humidity.max ||
           device.humidity < device.thresholds.humidity.min ||
           device.windSpeed > device.thresholds.windSpeed.max ||
           device.windSpeed < device.thresholds.windSpeed.min ||
           device.gasLevel > device.thresholds.gasLevel.max ||
           device.gasLevel < device.thresholds.gasLevel.min;
  }).length;

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setShowDetailModal(true);
  };

  const handleEditDevice = (device: Device) => {
    window.location.href = '/thresholds';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className={actualTheme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
            actualTheme === 'dark' 
              ? 'from-white to-gray-300' 
              : 'from-gray-900 to-gray-600'
          }`}>
            Real-Time Dashboard
          </h1>
          <p className={`mt-1 ${actualTheme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
            Monitor your IoT devices in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={`transition-colors ${
            actualTheme === 'dark' 
              ? 'bg-blue-900/20 text-blue-300 border-blue-700 hover:bg-blue-900/30' 
              : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
          }`}>
            🔄 Auto-refresh: 5s
          </Badge>
          <Badge variant="outline" className={`transition-colors ${
            actualTheme === 'dark' 
              ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' 
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}>
            🕒 {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
          actualTheme === 'dark' 
            ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${
              actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-800'
            }`}>
              Total Devices
            </CardTitle>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              actualTheme === 'dark' ? 'text-blue-200' : 'text-blue-900'
            }`}>
              {devices.length}
            </div>
            <p className={`text-xs mt-1 ${
              actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-700'
            }`}>
              {onlineDevices} online, {devices.length - onlineDevices} offline
            </p>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          activeAlerts > 0 
            ? actualTheme === 'dark'
              ? "bg-gradient-to-br from-red-900/50 to-red-800/50" 
              : "bg-gradient-to-br from-red-50 to-red-100"
            : actualTheme === 'dark'
              ? "bg-gradient-to-br from-green-900/50 to-green-800/50"
              : "bg-gradient-to-br from-green-50 to-green-100"
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${
              activeAlerts > 0 
                ? actualTheme === 'dark' ? 'text-red-300' : 'text-red-800'
                : actualTheme === 'dark' ? 'text-green-300' : 'text-green-800'
            }`}>
              Active Alerts
            </CardTitle>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              activeAlerts > 0 ? 'bg-red-500' : 'bg-green-500'
            }`}>
              <svg className={`h-4 w-4 text-white ${activeAlerts > 0 ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              activeAlerts > 0 
                ? actualTheme === 'dark' ? "text-red-200" : "text-red-900"
                : actualTheme === 'dark' ? "text-green-200" : "text-green-900"
            }`}>
              {activeAlerts}
            </div>
            <p className={`text-xs mt-1 ${
              activeAlerts > 0 
                ? actualTheme === 'dark' ? 'text-red-400' : 'text-red-700'
                : actualTheme === 'dark' ? 'text-green-400' : 'text-green-700'
            }`}>
              {activeAlerts > 0 ? "Requires immediate attention" : "All systems normal"}
            </p>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          criticalDevices > 0 
            ? actualTheme === 'dark'
              ? "bg-gradient-to-br from-orange-900/50 to-orange-800/50" 
              : "bg-gradient-to-br from-orange-50 to-orange-100"
            : actualTheme === 'dark'
              ? "bg-gradient-to-br from-green-900/50 to-green-800/50"
              : "bg-gradient-to-br from-green-50 to-green-100"
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${
              criticalDevices > 0 
                ? actualTheme === 'dark' ? 'text-orange-300' : 'text-orange-800'
                : actualTheme === 'dark' ? 'text-green-300' : 'text-green-800'
            }`}>
              Critical Devices
            </CardTitle>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              criticalDevices > 0 ? 'bg-orange-500' : 'bg-green-500'
            }`}>
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              criticalDevices > 0 
                ? actualTheme === 'dark' ? "text-orange-200" : "text-orange-900"
                : actualTheme === 'dark' ? "text-green-200" : "text-green-900"
            }`}>
              {criticalDevices}
            </div>
            <p className={`text-xs mt-1 ${
              criticalDevices > 0 
                ? actualTheme === 'dark' ? 'text-orange-400' : 'text-orange-700'
                : actualTheme === 'dark' ? 'text-green-400' : 'text-green-700'
            }`}>
              {criticalDevices > 0 ? "Outside threshold limits" : "All within limits"}
            </p>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
          actualTheme === 'dark' 
            ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/50' 
            : 'bg-gradient-to-br from-purple-50 to-purple-100'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${
              actualTheme === 'dark' ? 'text-purple-300' : 'text-purple-800'
            }`}>
              Avg Temperature
            </CardTitle>
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              actualTheme === 'dark' ? 'text-purple-200' : 'text-purple-900'
            }`}>
              {devices.length > 0 
                ? Math.round(devices.reduce((sum, d) => sum + d.temperature, 0) / devices.length)
                : 0}°C
            </div>
            <p className={`text-xs mt-1 ${
              actualTheme === 'dark' ? 'text-purple-400' : 'text-purple-700'
            }`}>
              Across all devices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Device Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Device Overview
            </h2>
            <p className={actualTheme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}>
              Click any card for detailed information
            </p>
          </div>
          <Badge 
            variant="outline" 
            className={`text-sm transition-colors ${
              connectionStatus === 'connected' 
                ? actualTheme === 'dark'
                  ? 'bg-green-900/20 text-green-300 border-green-700' 
                  : 'bg-green-50 text-green-700 border-green-200'
                : actualTheme === 'dark'
                  ? 'bg-yellow-900/20 text-yellow-300 border-yellow-700'
                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
            }`}
          >
            {connectionStatus === 'connected' ? '🟢 Live Data' : '🟡 Demo Data'}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {devices.map((device) => (
            <EnhancedDeviceCard
              key={device.id}
              device={device}
              onClick={() => handleDeviceClick(device)}
            />
          ))}
        </div>
      </div>

      {/* Recent Critical Alerts */}
      {activeAlerts > 0 && (
        <Card className={`border-0 shadow-lg ${
          actualTheme === 'dark' 
            ? 'bg-gradient-to-r from-red-900/30 to-pink-900/30 border-red-800' 
            : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${
              actualTheme === 'dark' ? 'text-red-300' : 'text-red-800'
            }`}>
              <svg className="h-5 w-5 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Recent Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.filter(a => !a.acknowledged).slice(0, 3).map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow ${
                  actualTheme === 'dark' 
                    ? 'bg-gray-800 border-red-800' 
                    : 'bg-white border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold text-sm ${
                        actualTheme === 'dark' ? 'text-red-300' : 'text-red-900'
                      }`}>
                        {alert.deviceName}
                      </p>
                      <p className={`text-xs mt-1 ${
                        actualTheme === 'dark' ? 'text-red-400' : 'text-red-700'
                      }`}>
                        {alert.message}
                      </p>
                      <p className={`text-xs mt-1 ${
                        actualTheme === 'dark' ? 'text-gray-500' : 'text-red-600'
                      }`}>
                        {alert.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      {alert.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Device Detail Modal */}
      <EnhancedDeviceDetailModal
        device={selectedDevice}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onEdit={handleEditDevice}
      />
    </div>
  );
}
