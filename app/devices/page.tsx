"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSafeFirebaseData } from "@/hooks/use-safe-firebase-data";
import { useAlertMonitoring } from "@/hooks/use-alert-monitoring";
import { DeviceStatusBadge } from "@/components/devices/device-status-badge";
import { AddDeviceDialog } from "@/components/devices/add-device-dialog";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DevicesPage() {
  const { devices, loading, addDevice, removeDevice } = useSafeFirebaseData();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Monitor devices for threshold breaches and generate alerts
  useAlertMonitoring(devices);

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveDevice = async (deviceId: string, deviceName: string) => {
    try {
      await removeDevice(deviceId);
      toast({
        title: "Device Removed ✅",
        description: `${deviceName} has been removed successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove device",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Device Management
          </h1>
          <p className="text-muted-foreground mt-1">Monitor and manage your IoT devices</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
            📊 {devices.length} Total Devices
          </Badge>
          <AddDeviceDialog />
        </div>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Devices Data Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span>Live Device Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 font-semibold text-gray-700">Device Name</th>
                  <th className="text-left py-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 font-semibold text-gray-700">Temperature</th>
                  <th className="text-left py-4 font-semibold text-gray-700">Humidity</th>
                  <th className="text-left py-4 font-semibold text-gray-700">Wind Speed</th>
                  <th className="text-left py-4 font-semibold text-gray-700">Gas Level</th>
                  <th className="text-left py-4 font-semibold text-gray-700">Last Updated</th>
                  <th className="text-left py-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                    <td className="py-4 font-medium text-gray-900">{device.name}</td>
                    <td className="py-4">
                      <DeviceStatusBadge status={device.status} />
                    </td>
                    <td className="py-4">
                      <span className={`font-semibold ${
                        device.temperature > device.thresholds.temperature.max || 
                        device.temperature < device.thresholds.temperature.min 
                          ? 'text-red-600 bg-red-50 px-2 py-1 rounded' : 'text-green-600 bg-green-50 px-2 py-1 rounded'
                      }`}>
                        {device.temperature}°C
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`font-semibold ${
                        device.humidity > device.thresholds.humidity.max || 
                        device.humidity < device.thresholds.humidity.min 
                          ? 'text-red-600 bg-red-50 px-2 py-1 rounded' : 'text-green-600 bg-green-50 px-2 py-1 rounded'
                      }`}>
                        {device.humidity}%
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`font-semibold ${
                        device.windSpeed > device.thresholds.windSpeed.max || 
                        device.windSpeed < device.thresholds.windSpeed.min 
                          ? 'text-red-600 bg-red-50 px-2 py-1 rounded' : 'text-green-600 bg-green-50 px-2 py-1 rounded'
                      }`}>
                        {device.windSpeed} m/s
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`font-semibold ${
                        device.gasLevel > device.thresholds.gasLevel.max || 
                        device.gasLevel < device.thresholds.gasLevel.min 
                          ? 'text-red-600 bg-red-50 px-2 py-1 rounded' : 'text-green-600 bg-green-50 px-2 py-1 rounded'
                      }`}>
                        {device.gasLevel} ppm
                      </span>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{device.lastUpdated.toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 transform hover:scale-105"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Device</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove "{device.name}"? This action cannot be undone and will also remove all associated alerts.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveDevice(device.id, device.name)}
                              className="bg-red-600 hover:bg-red-700 transition-colors duration-200"
                            >
                              Remove Device
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Devices Thresholds Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <span>Device Threshold Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 font-semibold text-gray-700">Device Name</th>
                  <th className="text-left py-4 font-semibold text-gray-700">Temperature Range</th>
                  <th className="text-left py-4 font-semibold text-gray-700">Humidity Range</th>
                  <th className="text-left py-4 font-semibold text-gray-700">Wind Speed Range</th>
                  <th className="text-left py-4 font-semibold text-gray-700">Gas Level Range</th>
                  <th className="text-left py-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200">
                    <td className="py-4 font-medium text-gray-900">{device.name}</td>
                    <td className="py-4">
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100 transition-colors">
                        🌡️ {device.thresholds.temperature.min}°C - {device.thresholds.temperature.max}°C
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors">
                        💧 {device.thresholds.humidity.min}% - {device.thresholds.humidity.max}%
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 transition-colors">
                        💨 {device.thresholds.windSpeed.min} - {device.thresholds.windSpeed.max} m/s
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 transition-colors">
                        ⚡ {device.thresholds.gasLevel.min} - {device.thresholds.gasLevel.max} ppm
                      </Badge>
                    </td>
                    <td className="py-4">
                      <DeviceStatusBadge status={device.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
