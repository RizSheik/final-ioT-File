"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Device } from "@/types/device";
import { DeviceStatusBadge } from "./device-status-badge";

interface DeviceCardProps {
  device: Device;
  onDeviceClick?: () => void;
}

export function DeviceCard({ device, onDeviceClick }: DeviceCardProps) {
  const isOutOfThreshold = (value: number, min: number, max: number) => {
    return value < min || value > max;
  };

  const getStatusColor = (value: number, min: number, max: number) => {
    return isOutOfThreshold(value, min, max) ? 'text-red-600' : 'text-green-600';
  };

  return (
    <div className={onDeviceClick ? "cursor-pointer" : ""} onClick={onDeviceClick}>
      <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{device.name}</CardTitle>
            <DeviceStatusBadge status={device.status} />
          </div>
          <div className="text-sm text-muted-foreground">
            📍 {device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">🌡️</span>
              <div>
                <p className={`font-semibold ${getStatusColor(
                  device.temperature,
                  device.thresholds.temperature.min,
                  device.thresholds.temperature.max
                )}`}>
                  {device.temperature}°C
                </p>
                <p className="text-xs text-muted-foreground">Temperature</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-blue-500">💧</span>
              <div>
                <p className={`font-semibold ${getStatusColor(
                  device.humidity,
                  device.thresholds.humidity.min,
                  device.thresholds.humidity.max
                )}`}>
                  {device.humidity}%
                </p>
                <p className="text-xs text-muted-foreground">Humidity</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">💨</span>
              <div>
                <p className={`font-semibold ${getStatusColor(
                  device.windSpeed,
                  device.thresholds.windSpeed.min,
                  device.thresholds.windSpeed.max
                )}`}>
                  {device.windSpeed} m/s
                </p>
                <p className="text-xs text-muted-foreground">Wind Speed</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500">⚡</span>
              <div>
                <p className={`font-semibold ${getStatusColor(
                  device.gasLevel,
                  device.thresholds.gasLevel.min,
                  device.thresholds.gasLevel.max
                )}`}>
                  {device.gasLevel} ppm
                </p>
                <p className="text-xs text-muted-foreground">Gas Level</p>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Updated: {device.lastUpdated.toLocaleTimeString()}
              </span>
              {onDeviceClick && (
                <Button size="sm" variant="outline" onClick={(e) => {
                  e.stopPropagation();
                  onDeviceClick();
                }}>
                  View Details
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
