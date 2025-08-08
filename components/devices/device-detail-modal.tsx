"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Device } from "@/types/device";
import { DeviceStatusBadge } from "./device-status-badge";

interface DeviceDetailModalProps {
  device: Device | null;
  open: boolean;
  onClose?: () => void;
  onEdit?: (device: Device) => void;
}

export function DeviceDetailModal({
  device,
  open,
  onClose,
  onEdit
}: DeviceDetailModalProps) {
  // Provide default implementations for optional callback props
  const handleClose = onClose || (() => {});
  const handleEdit = onEdit || (() => {});
  
  if (!device) return null;

  const getSensorStatus = (value: number, min: number, max: number) => {
    if (value < min) return { status: 'Below Threshold', color: 'bg-blue-100 text-blue-800' };
    if (value > max) return { status: 'Above Threshold', color: 'bg-red-100 text-red-800' };
    return { status: 'Normal', color: 'bg-green-100 text-green-800' };
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{device.name} - Device Details</DialogTitle>
            <DeviceStatusBadge status={device.status} />
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Device Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Device Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Device ID:</span>
                <span className="font-mono text-sm">{device.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Location:</span>
                <span>{device.latitude.toFixed(6)}, {device.longitude.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <DeviceStatusBadge status={device.status} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Updated:</span>
                <span>{device.lastUpdated.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Current Sensor Readings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Readings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Temperature */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🌡️</span>
                  <div>
                    <p className="font-semibold">Temperature</p>
                    <p className="text-2xl font-bold">{device.temperature}°C</p>
                  </div>
                </div>
                <Badge className={getSensorStatus(
                  device.temperature, 
                  device.thresholds.temperature.min, 
                  device.thresholds.temperature.max
                ).color}>
                  {getSensorStatus(
                    device.temperature, 
                    device.thresholds.temperature.min, 
                    device.thresholds.temperature.max
                  ).status}
                </Badge>
              </div>

              {/* Humidity */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">💧</span>
                  <div>
                    <p className="font-semibold">Humidity</p>
                    <p className="text-2xl font-bold">{device.humidity}%</p>
                  </div>
                </div>
                <Badge className={getSensorStatus(
                  device.humidity, 
                  device.thresholds.humidity.min, 
                  device.thresholds.humidity.max
                ).color}>
                  {getSensorStatus(
                    device.humidity, 
                    device.thresholds.humidity.min, 
                    device.thresholds.humidity.max
                  ).status}
                </Badge>
              </div>

              {/* Wind Speed */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">💨</span>
                  <div>
                    <p className="font-semibold">Wind Speed</p>
                    <p className="text-2xl font-bold">{device.windSpeed} m/s</p>
                  </div>
                </div>
                <Badge className={getSensorStatus(
                  device.windSpeed, 
                  device.thresholds.windSpeed.min, 
                  device.thresholds.windSpeed.max
                ).color}>
                  {getSensorStatus(
                    device.windSpeed, 
                    device.thresholds.windSpeed.min, 
                    device.thresholds.windSpeed.max
                  ).status}
                </Badge>
              </div>

              {/* Gas Level */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">⚡</span>
                  <div>
                    <p className="font-semibold">Gas Level</p>
                    <p className="text-2xl font-bold">{device.gasLevel} ppm</p>
                  </div>
                </div>
                <Badge className={getSensorStatus(
                  device.gasLevel, 
                  device.thresholds.gasLevel.min, 
                  device.thresholds.gasLevel.max
                ).color}>
                  {getSensorStatus(
                    device.gasLevel, 
                    device.thresholds.gasLevel.min, 
                    device.thresholds.gasLevel.max
                  ).status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Threshold Settings */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Threshold Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">🌡️ Temperature</h4>
                  <p className="text-sm text-muted-foreground">
                    Min: {device.thresholds.temperature.min}°C
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Max: {device.thresholds.temperature.max}°C
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">💧 Humidity</h4>
                  <p className="text-sm text-muted-foreground">
                    Min: {device.thresholds.humidity.min}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Max: {device.thresholds.humidity.max}%
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">💨 Wind Speed</h4>
                  <p className="text-sm text-muted-foreground">
                    Min: {device.thresholds.windSpeed.min} m/s
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Max: {device.thresholds.windSpeed.max} m/s
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">⚡ Gas Level</h4>
                  <p className="text-sm text-muted-foreground">
                    Min: {device.thresholds.gasLevel.min} ppm
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Max: {device.thresholds.gasLevel.max} ppm
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={() => handleEdit(device)}>
            Edit Thresholds
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
