"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpenStreetMap } from "@/components/maps/openstreet-map";
import { useSafeFirebaseData } from "@/hooks/use-safe-firebase-data";
import { useAlertMonitoring } from "@/hooks/use-alert-monitoring";
import { Device } from "@/types/device";
import { DeviceStatusBadge } from "@/components/devices/device-status-badge";
import { EnhancedDeviceDetailModal } from "@/components/devices/enhanced-device-detail-modal";
import { useTheme } from "@/hooks/use-theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function MapPage() {
  const { devices, loading } = useSafeFirebaseData();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { actualTheme } = useTheme();
  
  // Monitor devices for threshold breaches and generate alerts
  useAlertMonitoring(devices);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
  };

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setShowDetailModal(true);
  };

  const handleEditDevice = (device: Device) => {
    window.location.href = '/thresholds';
  };

  const handleCenterMap = () => {
    if (selectedDevice) {
      toast({
        title: "Map Centered 🗺️",
        description: `Centered on ${selectedDevice.name}`,
      });
    }
  };

  const handleExportMapData = () => {
    const mapData = {
      devices: devices.map(device => ({
        id: device.id,
        name: device.name,
        latitude: device.latitude,
        longitude: device.longitude,
        status: device.status,
        readings: {
          temperature: device.temperature,
          humidity: device.humidity,
          windSpeed: device.windSpeed,
          gasLevel: device.gasLevel
        }
      })),
      exportedAt: new Date().toISOString(),
      totalDevices: devices.length,
      onlineDevices: devices.filter(d => d.status === 'online').length
    };

    const blob = new Blob([JSON.stringify(mapData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `device-map-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    toast({
      title: "Map Data Exported! 📊",
      description: "Device location data has been exported successfully",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className={actualTheme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>
            Loading interactive map...
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
            Interactive Device Map
          </h1>
          <p className={`mt-1 ${actualTheme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
            Real-time device locations with live sensor data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className={`transition-colors ${
            actualTheme === 'dark' 
              ? 'bg-blue-900/20 text-blue-300 border-blue-700 hover:bg-blue-900/30' 
              : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
          }`}>
            🗺️ {devices.length} Devices
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportMapData}
            className={`transition-all duration-200 hover:scale-105 ${
              actualTheme === 'dark' 
                ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Map Data
          </Button>
        </div>
      </div>

      {/* Main Map */}
      <Card className={`border-0 shadow-lg ${
        actualTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className={`flex items-center space-x-2 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span>Device Locations - OpenStreetMap</span>
          </CardTitle>
          {selectedDevice && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`text-sm ${
                actualTheme === 'dark' 
                  ? 'bg-purple-900/20 text-purple-300 border-purple-700' 
                  : 'bg-purple-50 text-purple-700 border-purple-200'
              }`}>
                📍 {selectedDevice.name}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCenterMap}
                className={`transition-all duration-200 hover:scale-105 ${
                  actualTheme === 'dark' 
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Center
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] rounded-lg overflow-hidden relative border border-gray-300 shadow-sm">
            <OpenStreetMap
              devices={devices}
              selectedDevice={selectedDevice}
              onDeviceSelect={handleDeviceSelect}
            />
          </div>
        </CardContent>
      </Card>

      {/* Device Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {devices.map((device) => (
          <Card
            key={device.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-0 shadow-lg h-full flex flex-col bg-white ${
              selectedDevice?.id === device.id
                ? actualTheme === 'dark'
                  ? 'ring-2 ring-blue-500 bg-gray-800 shadow-blue-500/20'
                  : 'ring-2 ring-blue-500 bg-blue-50 shadow-blue-500/20'
                : actualTheme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-50'
            }`}
            onClick={() => handleDeviceClick(device)}
          >
            <CardHeader className="pb-1">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-sm flex items-center space-x-2 ${
                  actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    device.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}></div>
                  <span className="truncate">{device.name}</span>
                </CardTitle>
                <DeviceStatusBadge status={device.status} />
              </div>
              <div className={`text-sm flex items-center space-x-1 ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-1 h-full flex flex-col">
                <div className="grid grid-cols-2 gap-0.5 text-xs flex-grow">
                  <div className="flex items-center space-x-1">
                    <span className="text-red-500">🌡️</span>
                    <span className={`font-medium truncate ${
                      device.temperature > device.thresholds.temperature.max ||
                      device.temperature < device.thresholds.temperature.min
                        ? actualTheme === 'dark' ? 'text-red-400 font-bold animate-pulse' : 'text-red-600 font-bold animate-pulse'
                        : actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {device.temperature}°C
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-500">💧</span>
                    <span className={`font-medium truncate ${
                      device.humidity > device.thresholds.humidity.max ||
                      device.humidity < device.thresholds.humidity.min
                        ? actualTheme === 'dark' ? 'text-red-400 font-bold animate-pulse' : 'text-red-600 font-bold animate-pulse'
                        : actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {device.humidity}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">💨</span>
                    <span className={`font-medium truncate ${
                      device.windSpeed > device.thresholds.windSpeed.max ||
                      device.windSpeed < device.thresholds.windSpeed.min
                        ? actualTheme === 'dark' ? 'text-red-400 font-bold animate-pulse' : 'text-red-600 font-bold animate-pulse'
                        : actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {device.windSpeed} m/s
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⚡</span>
                    <span className={`font-medium truncate ${
                      device.gasLevel > device.thresholds.gasLevel.max ||
                      device.gasLevel < device.thresholds.gasLevel.min
                        ? actualTheme === 'dark' ? 'text-red-400 font-bold animate-pulse' : 'text-red-600 font-bold animate-pulse'
                        : actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {device.gasLevel} ppm
                    </span>
                  </div>
                </div>
                
                <div className={`flex items-center justify-between text-xs pt-1 border-t mt-auto ${
                  actualTheme === 'dark' ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-muted-foreground'
                }`}>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="truncate">Updated: {device.lastUpdated.toLocaleTimeString()}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeviceSelect(device);
                    }}
                    className={`h-6 px-2 text-xs transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                      actualTheme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Select
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Map Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card className={`border-0 shadow-lg bg-white`}>
          <CardHeader className="pb-1">
            <CardTitle className={`text-xs font-medium flex items-center space-x-2 ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Online Devices</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className={`text-2xl font-bold ${
              actualTheme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              {devices.filter(d => d.status === 'online').length}
            </div>
            <p className={`text-xs mt-1 ${
              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              of {devices.length} total devices
            </p>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-lg bg-white`}>
          <CardHeader className="pb-1">
            <CardTitle className={`text-xs font-medium flex items-center space-x-2 ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span>Coverage Area</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className={`text-2xl font-bold ${
              actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              NYC
            </div>
            <p className={`text-xs mt-1 ${
              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Metropolitan area
            </p>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-lg bg-white`}>
          <CardHeader className="pb-1">
            <CardTitle className={`text-xs font-medium flex items-center space-x-2 ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span>Data Points</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className={`text-2xl font-bold ${
              actualTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {devices.length * 4}
            </div>
            <p className={`text-xs mt-1 ${
              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              sensor readings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Device Detail Modal */}
      <EnhancedDeviceDetailModal
        device={selectedDevice}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onEdit={handleEditDevice}
      />
    </div>
  );
}
