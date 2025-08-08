"use client";

import { useEffect, useRef } from "react";
import { Device } from "@/types/device";

interface OpenStreetMapProps {
  devices: Device[];
  selectedDevice?: Device | null;
  onDeviceSelect?: (device: Device) => void;
}

export function OpenStreetMap({ devices, selectedDevice, onDeviceSelect }: OpenStreetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const updateMarkers = () => {
    if (!mapInstanceRef.current) return;

    const L = (window as any).L;
    
    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Filter devices with valid coordinates
    const validDevices = devices.filter(device => 
      typeof device.latitude === 'number' && 
      typeof device.longitude === 'number' &&
      !isNaN(device.latitude) && 
      !isNaN(device.longitude) &&
      isFinite(device.latitude) && 
      isFinite(device.longitude)
    );

    // Add markers for each valid device
    validDevices.forEach((device) => {
      const iconColor = device.status === 'online' ? '#10B981' : '#EF4444';
      
      // Create custom icon
      const customIcon = L.divIcon({
        html: `
          <div style="
            width: 24px; 
            height: 24px; 
            background-color: ${iconColor}; 
            border: 3px solid white; 
            border-radius: 50%; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
          ">
            ${device.status === 'online' ? '●' : '○'}
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([device.latitude, device.longitude], {
        icon: customIcon
      }).addTo(mapInstanceRef.current);

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px; padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #333;">${device.name}</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 4px;">🌡️</span>
              <span style="color: ${device.temperature > device.thresholds.temperature.max || device.temperature < device.thresholds.temperature.min ? '#EF4444' : '#10B981'};">
                ${device.temperature}°C
              </span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 4px;">💧</span>
              <span style="color: ${device.humidity > device.thresholds.humidity.max || device.humidity < device.thresholds.humidity.min ? '#EF4444' : '#10B981'};">
                ${device.humidity}%
              </span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 4px;">💨</span>
              <span style="color: ${device.windSpeed > device.thresholds.windSpeed.max || device.windSpeed < device.thresholds.windSpeed.min ? '#EF4444' : '#10B981'};">
                ${device.windSpeed} m/s
              </span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 4px;">⚡</span>
              <span style="color: ${device.gasLevel > device.thresholds.gasLevel.max || device.gasLevel < device.thresholds.gasLevel.min ? '#EF4444' : '#10B981'};">
                ${device.gasLevel} ppm
              </span>
            </div>
          </div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
            <span style="padding: 2px 6px; border-radius: 4px; font-size: 10px; background: ${device.status === 'online' ? '#10B981' : '#EF4444'}; color: white;">
              ${device.status.toUpperCase()}
            </span>
            <div style="margin-top: 4px; font-size: 10px; color: #666;">
              Updated: ${device.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Add click event
      marker.on('click', () => {
        if (onDeviceSelect) {
          onDeviceSelect(device);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers with validation
    if (validDevices.length > 0) {
      try {
        const group = new L.featureGroup(markersRef.current);
        const bounds = group.getBounds();
        
        // Check if bounds are valid before fitting
        if (bounds.isValid()) {
          mapInstanceRef.current.fitBounds(bounds.pad(0.1));
        } else {
          console.warn('Invalid bounds for fitBounds operation');
        }
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    }
  };

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!(window as any).L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = (window as any).L;
      
      // Initialize map
      const map = L.map(mapRef.current, {
        zoom: 10,
        center: [40.7128, -74.0060],
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        dragging: true,
        touchZoom: true
      });
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add device markers
      updateMarkers();
      
      // Handle map resize
      const handleResize = () => {
        if (mapRef.current && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };
      
      // Add resize listener
      window.addEventListener('resize', handleResize);
      
      // Cleanup resize listener
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when devices change
  useEffect(() => {
    if (mapInstanceRef.current && (window as any).L) {
      updateMarkers();
    }
  }, [devices, onDeviceSelect]);

  // Center on selected device
  useEffect(() => {
    if (selectedDevice && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedDevice.latitude, selectedDevice.longitude], 15);
    }
  }, [selectedDevice]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[300px] rounded-lg border"
      style={{ height: '500px', zIndex: 'auto' }}
    />
  );
}
