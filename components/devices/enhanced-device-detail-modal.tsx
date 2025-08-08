"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Device } from "@/types/device";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "@/hooks/use-toast";
import { MapPin, Thermometer, Droplets, Wind, Zap, Clock, Settings, Download, Share2, Copy, TrendingUp, AlertTriangle, CheckCircle, Activity, BarChart3, Calendar, Globe } from 'lucide-react';

interface EnhancedDeviceDetailModalProps {
  device: Device | null;
  open: boolean;
  onClose?: () => void;
  onEdit?: (device: Device) => void;
}

export function EnhancedDeviceDetailModal({
  device,
  open,
  onClose,
  onEdit
}: EnhancedDeviceDetailModalProps) {
  // Provide default implementations for optional callback props
  const handleClose = onClose || (() => {});
  const handleEdit = onEdit || (() => {});
  
  const { actualTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  if (!device) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return actualTheme === 'dark' ? 'text-green-400 bg-green-900/20 border-green-700' : 'text-green-600 bg-green-50 border-green-200';
      case 'offline':
        return actualTheme === 'dark' ? 'text-red-400 bg-red-900/20 border-red-700' : 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return actualTheme === 'dark' ? 'text-yellow-400 bg-yellow-900/20 border-yellow-700' : 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return actualTheme === 'dark' ? 'text-gray-400 bg-gray-900/20 border-gray-700' : 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getThresholdStatus = (value: number, min: number, max: number) => {
      if (value < min || value > max) {
        return { status: 'critical', color: actualTheme === 'dark' ? 'text-red-400' : 'text-red-600' };
      } else if (value < min * 1.1 && value > max * 0.9) {
        return { status: 'warning', color: actualTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600' };
      } else {
        return { status: 'normal', color: actualTheme === 'dark' ? 'text-green-400' : 'text-green-600' };
      }
    };

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(`${device.latitude}, ${device.longitude}`);
    toast({
      title: "Location Copied! 📍",
      description: "Coordinates copied to clipboard",
    });
  };

  const handleExportData = () => {
    const exportData = {
      device: {
        id: device.id,
        name: device.name,
        status: device.status,
        location: {
          latitude: device.latitude,
          longitude: device.longitude
        },
        readings: {
          temperature: device.temperature,
          humidity: device.humidity,
          windSpeed: device.windSpeed,
          gasLevel: device.gasLevel
        },
        thresholds: device.thresholds,
        lastUpdated: device.lastUpdated
      },
      exportedAt: new Date().toISOString(),
      exportedBy: "System Administrator"
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `device-${device.name}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    toast({
      title: "Data Exported! 📊",
      description: `${device.name} data exported successfully`,
    });
  };

  const handleShareDevice = () => {
    const shareData = {
      title: `Device: ${device.name}`,
      text: `Check out this device data from our monitoring system`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      toast({
        title: "Share Link Copied! 🔗",
        description: "Device information copied to clipboard",
      });
    }
  };

  const temperatureStatus = getThresholdStatus(device.temperature, device.thresholds.temperature.min, device.thresholds.temperature.max);
  const humidityStatus = getThresholdStatus(device.humidity, device.thresholds.humidity.min, device.thresholds.humidity.max);
  const windSpeedStatus = getThresholdStatus(device.windSpeed, device.thresholds.windSpeed.min, device.thresholds.windSpeed.max);
  const gasLevelStatus = getThresholdStatus(device.gasLevel, device.thresholds.gasLevel.min, device.thresholds.gasLevel.max);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`max-w-6xl w-[90vw] h-[90vh] p-0 shadow-2xl backdrop-blur-sm bg-white border-gray-200 z-[2002] max-h-[90vh] overflow-hidden`}>
        <DialogHeader className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {device.name}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <Badge className={`${getStatusColor(device.status)} border`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      device.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`}></div>
                    {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Updated {device.lastUpdated.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLocation}
                className="transition-all duration-200 hover:bg-gray-100"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Location
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                className="transition-all duration-200 hover:bg-gray-100"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareDevice}
                className="transition-all duration-200 hover:bg-gray-100"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                onClick={() => handleEdit(device)}
                size="sm"
                className="transition-all duration-200 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Settings
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-4 border-b border-gray-200">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="readings" className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Sensor Data</span>
                </TabsTrigger>
                <TabsTrigger value="location" className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Location</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>History</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 p-4 h-full max-h-[calc(90vh-100px)]">
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Real-time Readings */}
                  <Card className="border-0 shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
                        <Thermometer className="w-5 h-5 text-red-500" />
                        <span>Temperature</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-2xl font-bold ${temperatureStatus.color}`}>
                            {device.temperature}°C
                          </span>
                          <Badge variant="outline" className={`${
                            temperatureStatus.status === 'critical' ? 'border-red-500 text-red-500' :
                            temperatureStatus.status === 'warning' ? 'border-yellow-500 text-yellow-500' :
                            'border-green-500 text-green-500'
                          }`}>
                            {temperatureStatus.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Range: {device.thresholds.temperature.min}°C - {device.thresholds.temperature.max}°C
                            </span>
                          </div>
                          <Progress 
                            value={((device.temperature - device.thresholds.temperature.min) / 
                                   (device.thresholds.temperature.max - device.thresholds.temperature.min)) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <span>Humidity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-2xl font-bold ${humidityStatus.color}`}>
                            {device.humidity}%
                          </span>
                          <Badge variant="outline" className={`${
                            humidityStatus.status === 'critical' ? 'border-red-500 text-red-500' :
                            humidityStatus.status === 'warning' ? 'border-yellow-500 text-yellow-500' :
                            'border-green-500 text-green-500'
                          }`}>
                            {humidityStatus.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Range: {device.thresholds.humidity.min}% - {device.thresholds.humidity.max}%
                            </span>
                          </div>
                          <Progress 
                            value={((device.humidity - device.thresholds.humidity.min) / 
                                   (device.thresholds.humidity.max - device.thresholds.humidity.min)) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
                        <Wind className="w-5 h-5 text-gray-500" />
                        <span>Wind Speed</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-2xl font-bold ${windSpeedStatus.color}`}>
                            {device.windSpeed} m/s
                          </span>
                          <Badge variant="outline" className={`${
                            windSpeedStatus.status === 'critical' ? 'border-red-500 text-red-500' :
                            windSpeedStatus.status === 'warning' ? 'border-yellow-500 text-yellow-500' :
                            'border-green-500 text-green-500'
                          }`}>
                            {windSpeedStatus.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Range: {device.thresholds.windSpeed.min} - {device.thresholds.windSpeed.max} m/s
                            </span>
                          </div>
                          <Progress 
                            value={((device.windSpeed - device.thresholds.windSpeed.min) / 
                                   (device.thresholds.windSpeed.max - device.thresholds.windSpeed.min)) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <span>Gas Level</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-2xl font-bold ${gasLevelStatus.color}`}>
                            {device.gasLevel} ppm
                          </span>
                          <Badge variant="outline" className={`${
                            gasLevelStatus.status === 'critical' ? 'border-red-500 text-red-500' :
                            gasLevelStatus.status === 'warning' ? 'border-yellow-500 text-yellow-500' :
                            'border-green-500 text-green-500'
                          }`}>
                            {gasLevelStatus.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Range: {device.thresholds.gasLevel.min} - {device.thresholds.gasLevel.max} ppm
                            </span>
                          </div>
                          <Progress 
                            value={((device.gasLevel - device.thresholds.gasLevel.min) / 
                                   (device.thresholds.gasLevel.max - device.thresholds.gasLevel.min)) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Device Information */}
                  <Card className="border-0 shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
                        <Settings className="w-5 h-5 text-purple-500" />
                        <span>Device Info</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Device ID:
                          </span>
                          <span className="font-mono text-sm text-gray-700">
                            {device.id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Status:
                          </span>
                          <Badge className={getStatusColor(device.status)}>
                            {device.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Last Update:
                          </span>
                          <span className="text-sm text-gray-700">
                            {device.lastUpdated.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Coordinates:
                          </span>
                          <span className="text-sm font-mono text-gray-700">
                            {device.latitude.toFixed(6)}, {device.longitude.toFixed(6)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Health */}
                  <Card className="border-0 shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span>System Health</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">
                              Connectivity
                            </span>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-500">
                            Excellent
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-700">
                              Data Quality
                            </span>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-500">
                            High
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-700">
                              Alerts
                            </span>
                          </div>
                          <Badge variant="outline" className="text-yellow-600 border-yellow-500">
                            2 Active
                          </Badge>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              Overall Health
                            </span>
                            <span className="text-green-600">
                              85%
                            </span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="readings" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Detailed sensor readings would go here */}
                  <Card className="border-0 shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="text-gray-900">
                        Sensor Readings History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Historical data visualization would be displayed here</p>
                        <p className="text-sm opacity-75">Charts and graphs showing sensor trends over time</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="location" className="mt-0">
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">
                      Device Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Interactive map would be displayed here</p>
                      <p className="text-sm opacity-75">Showing precise device location and surrounding area</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">
                      Device History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Device activity timeline would be displayed here</p>
                      <p className="text-sm opacity-75">Historical events, maintenance records, and alerts</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
