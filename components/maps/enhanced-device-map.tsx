"use client";

import { useEffect, useRef, useState } from "react";
import { Device } from "@/types/device";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeviceStatusBadge } from "@/components/devices/device-status-badge";

interface EnhancedDeviceMapProps {
  devices: Device[];
  selectedDevice?: Device | null;
  onDeviceSelect?: (device: Device) => void;
}

export function EnhancedDeviceMap({ devices, selectedDevice, onDeviceSelect }: EnhancedDeviceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps is available
    if (!mapRef.current || typeof window === 'undefined' || !window.google) {
      return;
    }

    try {
      // Initialize map
      const map = new google.maps.Map(mapRef.current, {
        zoom: 11,
        center: { lat: 40.7128, lng: -74.0060 },
        mapTypeId: google.maps.MapTypeId.HYBRID,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      mapInstanceRef.current = map;
      setMapLoaded(true);

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add markers for each device
      devices.forEach((device) => {
        const marker = new google.maps.Marker({
          position: { lat: device.latitude, lng: device.longitude },
          map: map,
          title: device.name,
          icon: {
            url: device.status === 'online' 
              ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#10B981" stroke="#ffffff" strokeWidth="3"/>
                  <circle cx="16" cy="16" r="4" fill="#ffffff"/>
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.3"/>
                </svg>
              `)
              : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="#ffffff" strokeWidth="3"/>
                  <circle cx="16" cy="16" r="4" fill="#ffffff"/>
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#EF4444" strokeWidth="1" opacity="0.3"/>
                </svg>
              `),
            scaledSize: new google.maps.Size(32, 32),
          },
        });

        // Create info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${device.name}</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 12px;">
                <div>🌡️ ${device.temperature}°C</div>
                <div>💧 ${device.humidity}%</div>
                <div>💨 ${device.windSpeed} m/s</div>
                <div>⚡ ${device.gasLevel} ppm</div>
              </div>
              <div style="margin-top: 8px;">
                <span style="padding: 2px 6px; border-radius: 4px; font-size: 10px; background: ${device.status === 'online' ? '#10B981' : '#EF4444'}; color: white;">
                  ${device.status.toUpperCase()}
                </span>
              </div>
            </div>
          `
        });

        // Add click listeners
        marker.addListener('click', () => {
          // Close all other info windows
          markersRef.current.forEach(m => {
            if ((m as any).infoWindow) {
              (m as any).infoWindow.close();
            }
          });
          
          infoWindow.open(map, marker);
          
          if (onDeviceSelect) {
            onDeviceSelect(device);
          }
        });

        // Store info window reference
        (marker as any).infoWindow = infoWindow;
        markersRef.current.push(marker);
      });

      // Fit bounds to show all markers
      if (devices.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        devices.forEach(device => {
          bounds.extend({ lat: device.latitude, lng: device.longitude });
        });
        map.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }

  }, [devices, onDeviceSelect]);

  // Center on selected device
  useEffect(() => {
    if (selectedDevice && mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({
        lat: selectedDevice.latitude,
        lng: selectedDevice.longitude
      });
      mapInstanceRef.current.setZoom(15);
    }
  }, [selectedDevice]);

  // Fallback UI when Google Maps is not available
  if (!mapLoaded && (typeof window === 'undefined' || !window.google)) {
    return (
      <div className="w-full h-full min-h-[500px] rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="h-16 w-16 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-lg font-semibold text-gray-700 mb-2">Interactive Map</p>
          <p className="text-sm text-gray-500">Loading device locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div 
        ref={mapRef} 
        className="w-full h-[200px] rounded-lg shadow-lg"
      />
      
      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {devices.map((device) => (
          <Card 
            key={device.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedDevice?.id === device.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
            onClick={() => onDeviceSelect && onDeviceSelect(device)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{device.name}</CardTitle>
                <DeviceStatusBadge status={device.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-red-500">🌡️</span>
                  <span>{device.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-blue-500">💧</span>
                  <span>{device.humidity}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500">💨</span>
                  <span>{device.windSpeed} m/s</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">⚡</span>
                  <span>{device.gasLevel} ppm</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>{device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Updated: {device.lastUpdated.toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
