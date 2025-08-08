"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useSafeFirebaseData } from "@/hooks/use-safe-firebase-data";
import { useAlertMonitoring } from "@/hooks/use-alert-monitoring";
import { DeviceStatusBadge } from "@/components/devices/device-status-badge";
import { toast } from "@/hooks/use-toast";
import { Device } from "@/types/device";

export default function ThresholdsPage() {
  const { devices, loading, updateDevice } = useSafeFirebaseData();
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [thresholds, setThresholds] = useState({
    tempMin: "",
    tempMax: "",
    humidityMin: "",
    humidityMax: "",
    windMin: "",
    windMax: "",
    gasMin: "",
    gasMax: ""
  });
  
  // Monitor devices for threshold breaches and generate alerts
  useAlertMonitoring(devices);

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
    setThresholds({
      tempMin: device.thresholds.temperature.min.toString(),
      tempMax: device.thresholds.temperature.max.toString(),
      humidityMin: device.thresholds.humidity.min.toString(),
      humidityMax: device.thresholds.humidity.max.toString(),
      windMin: device.thresholds.windSpeed.min.toString(),
      windMax: device.thresholds.windSpeed.max.toString(),
      gasMin: device.thresholds.gasLevel.min.toString(),
      gasMax: device.thresholds.gasLevel.max.toString()
    });
  };

  const handleSaveThresholds = async () => {
    if (!editingDevice) return;

    try {
      const updatedThresholds = {
        thresholds: {
          temperature: {
            min: parseFloat(thresholds.tempMin),
            max: parseFloat(thresholds.tempMax)
          },
          humidity: {
            min: parseFloat(thresholds.humidityMin),
            max: parseFloat(thresholds.humidityMax)
          },
          windSpeed: {
            min: parseFloat(thresholds.windMin),
            max: parseFloat(thresholds.windMax)
          },
          gasLevel: {
            min: parseFloat(thresholds.gasMin),
            max: parseFloat(thresholds.gasMax)
          }
        }
      };

      await updateDevice(editingDevice.id, updatedThresholds);
      setEditingDevice(null);
      toast({
        title: "Success! ✅",
        description: "Thresholds updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update thresholds",
        variant: "destructive"
      });
    }
  };

  const getThresholdStatus = (value: number, min: number, max: number) => {
    if (value < min || value > max) {
      return { status: 'Violation', color: 'bg-red-100 text-red-800 border-red-200 animate-pulse' };
    }
    return { status: 'Normal', color: 'bg-green-100 text-green-800 border-green-200' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading thresholds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Threshold Management
          </h1>
          <p className="text-muted-foreground mt-1">Configure device alert thresholds and monitoring limits</p>
        </div>
        <Badge variant="outline" className="text-sm bg-purple-50 text-purple-700 border-purple-200">
          ⚙️ {devices.length} Devices Configured
        </Badge>
      </div>

      {/* Threshold Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <Card key={device.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${device.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span>{device.name}</span>
                </CardTitle>
                <DeviceStatusBadge status={device.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Values vs Thresholds */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 border border-red-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🌡️</span>
                    <span className="text-sm font-medium">{device.temperature}°C</span>
                  </div>
                  <Badge className={getThresholdStatus(
                    device.temperature,
                    device.thresholds.temperature.min,
                    device.thresholds.temperature.max
                  ).color}>
                    {getThresholdStatus(
                      device.temperature,
                      device.thresholds.temperature.min,
                      device.thresholds.temperature.max
                    ).status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">💧</span>
                    <span className="text-sm font-medium">{device.humidity}%</span>
                  </div>
                  <Badge className={getThresholdStatus(
                    device.humidity,
                    device.thresholds.humidity.min,
                    device.thresholds.humidity.max
                  ).color}>
                    {getThresholdStatus(
                      device.humidity,
                      device.thresholds.humidity.min,
                      device.thresholds.humidity.max
                    ).status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">💨</span>
                    <span className="text-sm font-medium">{device.windSpeed} m/s</span>
                  </div>
                  <Badge className={getThresholdStatus(
                    device.windSpeed,
                    device.thresholds.windSpeed.min,
                    device.thresholds.windSpeed.max
                  ).color}>
                    {getThresholdStatus(
                      device.windSpeed,
                      device.thresholds.windSpeed.min,
                      device.thresholds.windSpeed.max
                    ).status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">⚡</span>
                    <span className="text-sm font-medium">{device.gasLevel} ppm</span>
                  </div>
                  <Badge className={getThresholdStatus(
                    device.gasLevel,
                    device.thresholds.gasLevel.min,
                    device.thresholds.gasLevel.max
                  ).color}>
                    {getThresholdStatus(
                      device.gasLevel,
                      device.thresholds.gasLevel.min,
                      device.thresholds.gasLevel.max
                    ).status}
                  </Badge>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg" 
                onClick={() => handleEditDevice(device)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
                </svg>
                Edit Thresholds
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Threshold Modal */}
      {editingDevice && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <CardTitle className="flex items-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
                </svg>
                <span>Edit Thresholds - {editingDevice.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Temperature */}
                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 border border-red-200">
                  <Label className="flex items-center space-x-2 font-semibold text-red-800">
                    <span className="text-xl">🌡️</span>
                    <span>Temperature (°C)</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="tempMin" className="text-xs text-red-700">Minimum</Label>
                      <Input
                        id="tempMin"
                        type="number"
                        value={thresholds.tempMin}
                        onChange={(e) => setThresholds({...thresholds, tempMin: e.target.value})}
                        placeholder="Min"
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tempMax" className="text-xs text-red-700">Maximum</Label>
                      <Input
                        id="tempMax"
                        type="number"
                        value={thresholds.tempMax}
                        onChange={(e) => setThresholds({...thresholds, tempMax: e.target.value})}
                        placeholder="Max"
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Humidity */}
                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                  <Label className="flex items-center space-x-2 font-semibold text-blue-800">
                    <span className="text-xl">💧</span>
                    <span>Humidity (%)</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="humidityMin" className="text-xs text-blue-700">Minimum</Label>
                      <Input
                        id="humidityMin"
                        type="number"
                        value={thresholds.humidityMin}
                        onChange={(e) => setThresholds({...thresholds, humidityMin: e.target.value})}
                        placeholder="Min"
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="humidityMax" className="text-xs text-blue-700">Maximum</Label>
                      <Input
                        id="humidityMax"
                        type="number"
                        value={thresholds.humidityMax}
                        onChange={(e) => setThresholds({...thresholds, humidityMax: e.target.value})}
                        placeholder="Max"
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Wind Speed */}
                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200">
                  <Label className="flex items-center space-x-2 font-semibold text-gray-800">
                    <span className="text-xl">💨</span>
                    <span>Wind Speed (m/s)</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="windMin" className="text-xs text-gray-700">Minimum</Label>
                      <Input
                        id="windMin"
                        type="number"
                        value={thresholds.windMin}
                        onChange={(e) => setThresholds({...thresholds, windMin: e.target.value})}
                        placeholder="Min"
                        className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="windMax" className="text-xs text-gray-700">Maximum</Label>
                      <Input
                        id="windMax"
                        type="number"
                        value={thresholds.windMax}
                        onChange={(e) => setThresholds({...thresholds, windMax: e.target.value})}
                        placeholder="Max"
                        className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Gas Level */}
                <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200">
                  <Label className="flex items-center space-x-2 font-semibold text-yellow-800">
                    <span className="text-xl">⚡</span>
                    <span>Gas Level (ppm)</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="gasMin" className="text-xs text-yellow-700">Minimum</Label>
                      <Input
                        id="gasMin"
                        type="number"
                        value={thresholds.gasMin}
                        onChange={(e) => setThresholds({...thresholds, gasMin: e.target.value})}
                        placeholder="Min"
                        className="border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gasMax" className="text-xs text-yellow-700">Maximum</Label>
                      <Input
                        id="gasMax"
                        type="number"
                        value={thresholds.gasMax}
                        onChange={(e) => setThresholds({...thresholds, gasMax: e.target.value})}
                        placeholder="Max"
                        className="border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingDevice(null)}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveThresholds}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Thresholds
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
