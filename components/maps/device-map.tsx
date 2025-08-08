"use client";

import { useEffect, useRef } from "react";
import { Device } from "@/types/device";

interface DeviceMapProps {
  devices: Device[];
  selectedDevice?: Device | null;
  onDeviceSelect?: (device: Device) => void;
}

export function DeviceMap({ devices, selectedDevice, onDeviceSelect }: DeviceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    // Check if Google Maps is available
    if (!mapRef.current || typeof window === 'undefined' || !window.google) {
      return;
    }

    try {
      // Initialize map
      const map = new google.maps.Map(mapRef.current, {
        zoom: 10,
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        mapTypeId: google.maps.MapTypeId.SATELLITE,
      });

      mapInstanceRef.current = map;

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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#10B981" stroke="#ffffff" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill="#ffffff"/>
                </svg>
              `)
              : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#EF4444" stroke="#ffffff" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill="#ffffff"/>
                </svg>
              `),
            scaledSize: new google.maps.Size(24, 24),
          },
        });

        // Add click listener
        marker.addListener('click', () => {
          if (onDeviceSelect) {
            onDeviceSelect(device);
          }
        });

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
  if (typeof window === 'undefined' || !window.google) {
    return (
      <div className="w-full h-full min-h-[400px] rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-2">🗺️</div>
          <p className="text-gray-600">Map Loading...</p>
          <p className="text-sm text-gray-500">Google Maps API required</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-[400px] rounded-lg"
      style={{ minHeight: '400px' }}
    />
  );
}
