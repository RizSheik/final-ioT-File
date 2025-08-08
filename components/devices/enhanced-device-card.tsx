"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Device } from "@/types/device";
import { DeviceStatusBadge } from "./device-status-badge";

interface EnhancedDeviceCardProps {
  device: Device;
  onClick?: () => void;
}

export function EnhancedDeviceCard({ device, onClick }: EnhancedDeviceCardProps) {
  // Provide default implementation for optional callback prop
  const handleClick = onClick || (() => {});
  
  const isOutOfThreshold = (value: number, min: number, max: number) => {
    return value < min || value > max;
  };

  const getStatusColor = (value: number, min: number, max: number) => {
    return isOutOfThreshold(value, min, max) ? 'text-red-600 font-bold animate-pulse' : 'text-green-600';
  };

  const getStatusBg = (value: number, min: number, max: number) => {
    return isOutOfThreshold(value, min, max) ? 'bg-red-100 border-red-300 animate-pulse' : 'bg-green-50 border-green-200';
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${device.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span>{device.name}</span>
          </CardTitle>
          <DeviceStatusBadge status={device.status} />
        </div>
        <div className="text-sm text-muted-foreground flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className={`flex items-center space-x-2 p-1.5 rounded-lg border transition-colors ${getStatusBg(device.temperature, device.thresholds.temperature.min, device.thresholds.temperature.max)}`}>
            <span className="text-lg">🌡️</span>
            <div>
              <p className={`font-semibold ${getStatusColor(device.temperature, device.thresholds.temperature.min, device.thresholds.temperature.max)}`}>
                {device.temperature}°C
              </p>
              <p className="text-xs text-muted-foreground">Temperature</p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-2 p-1.5 rounded-lg border transition-colors ${getStatusBg(device.humidity, device.thresholds.humidity.min, device.thresholds.humidity.max)}`}>
            <span className="text-lg">💧</span>
            <div>
              <p className={`font-semibold ${getStatusColor(device.humidity, device.thresholds.humidity.min, device.thresholds.humidity.max)}`}>
                {device.humidity}%
              </p>
              <p className="text-xs text-muted-foreground">Humidity</p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-2 p-1.5 rounded-lg border transition-colors ${getStatusBg(device.windSpeed, device.thresholds.windSpeed.min, device.thresholds.windSpeed.max)}`}>
            <span className="text-lg">💨</span>
            <div>
              <p className={`font-semibold ${getStatusColor(device.windSpeed, device.thresholds.windSpeed.min, device.thresholds.windSpeed.max)}`}>
                {device.windSpeed} m/s
              </p>
              <p className="text-xs text-muted-foreground">Wind Speed</p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-2 p-1.5 rounded-lg border transition-colors ${getStatusBg(device.gasLevel, device.thresholds.gasLevel.min, device.thresholds.gasLevel.max)}`}>
            <span className="text-lg">⚡</span>
            <div>
              <p className={`font-semibold ${getStatusColor(device.gasLevel, device.thresholds.gasLevel.min, device.thresholds.gasLevel.max)}`}>
                {device.gasLevel} ppm
              </p>
              <p className="text-xs text-muted-foreground">Gas Level</p>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Updated: {device.lastUpdated.toLocaleTimeString()}</span>
            </div>
            <Button
              size="sm"
              className="h-7 px-2 text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
