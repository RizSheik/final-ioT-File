import { useEffect, useRef } from 'react';
import { Device, Alert } from '@/types/device';
import { FirebaseService } from '@/lib/firebase-service';
import { calculateDistance } from '@/lib/utils';

export function useAlertMonitoring(devices: Device[]) {
  // Keep track of active alerts to avoid duplicates
  const activeAlerts = useRef<Set<string>>(new Set());
  // Keep track of previous device locations
  const previousLocations = useRef<Map<string, { lat: number; lon: number }>>(new Map());

  useEffect(() => {
    const checkThresholdsAndGenerateAlerts = async () => {
      const now = new Date();
      
      for (const device of devices) {
        // Check temperature threshold
        if (device.temperature > device.thresholds.temperature.max ||
            device.temperature < device.thresholds.temperature.min) {
          const alertKey = `${device.id}-temperature`;
          if (!activeAlerts.current.has(alertKey)) {
            // Create temperature alert
            const alert: Omit<Alert, 'id'> = {
              deviceId: device.id,
              deviceName: device.name,
              type: 'temperature',
              value: device.temperature,
              threshold: device.temperature > device.thresholds.temperature.max
                ? device.thresholds.temperature.max
                : device.thresholds.temperature.min,
              message: device.temperature > device.thresholds.temperature.max
                ? `Temperature exceeded maximum threshold of ${device.thresholds.temperature.max}°C`
                : `Temperature below minimum threshold of ${device.thresholds.temperature.min}°C`,
              createdAt: now,
              acknowledged: false
            };
            
            try {
              await FirebaseService.addAlert(alert);
              activeAlerts.current.add(alertKey);
              console.log(`Created temperature alert for device ${device.name}`);
            } catch (error) {
              console.error('Error creating temperature alert:', error);
            }
          }
        } else {
          // Clear active alert if threshold is back to normal
          const alertKey = `${device.id}-temperature`;
          activeAlerts.current.delete(alertKey);
        }
        
        // Check humidity threshold
        if (device.humidity > device.thresholds.humidity.max ||
            device.humidity < device.thresholds.humidity.min) {
          const alertKey = `${device.id}-humidity`;
          if (!activeAlerts.current.has(alertKey)) {
            // Create humidity alert
            const alert: Omit<Alert, 'id'> = {
              deviceId: device.id,
              deviceName: device.name,
              type: 'humidity',
              value: device.humidity,
              threshold: device.humidity > device.thresholds.humidity.max
                ? device.thresholds.humidity.max
                : device.thresholds.humidity.min,
              message: device.humidity > device.thresholds.humidity.max
                ? `Humidity exceeded maximum threshold of ${device.thresholds.humidity.max}%`
                : `Humidity below minimum threshold of ${device.thresholds.humidity.min}%`,
              createdAt: now,
              acknowledged: false
            };
            
            try {
              await FirebaseService.addAlert(alert);
              activeAlerts.current.add(alertKey);
              console.log(`Created humidity alert for device ${device.name}`);
            } catch (error) {
              console.error('Error creating humidity alert:', error);
            }
          }
        } else {
          // Clear active alert if threshold is back to normal
          const alertKey = `${device.id}-humidity`;
          activeAlerts.current.delete(alertKey);
        }
        
        // Check wind speed threshold
        if (device.windSpeed > device.thresholds.windSpeed.max ||
            device.windSpeed < device.thresholds.windSpeed.min) {
          const alertKey = `${device.id}-windSpeed`;
          if (!activeAlerts.current.has(alertKey)) {
            // Create wind speed alert
            const alert: Omit<Alert, 'id'> = {
              deviceId: device.id,
              deviceName: device.name,
              type: 'windSpeed',
              value: device.windSpeed,
              threshold: device.windSpeed > device.thresholds.windSpeed.max
                ? device.thresholds.windSpeed.max
                : device.thresholds.windSpeed.min,
              message: device.windSpeed > device.thresholds.windSpeed.max
                ? `Wind speed exceeded maximum threshold of ${device.thresholds.windSpeed.max} m/s`
                : `Wind speed below minimum threshold of ${device.thresholds.windSpeed.min} m/s`,
              createdAt: now,
              acknowledged: false
            };
            
            try {
              await FirebaseService.addAlert(alert);
              activeAlerts.current.add(alertKey);
              console.log(`Created wind speed alert for device ${device.name}`);
            } catch (error) {
              console.error('Error creating wind speed alert:', error);
            }
          }
        } else {
          // Clear active alert if threshold is back to normal
          const alertKey = `${device.id}-windSpeed`;
          activeAlerts.current.delete(alertKey);
        }
        
        // Check gas level threshold
        if (device.gasLevel > device.thresholds.gasLevel.max ||
            device.gasLevel < device.thresholds.gasLevel.min) {
          const alertKey = `${device.id}-gasLevel`;
          if (!activeAlerts.current.has(alertKey)) {
            // Create gas level alert
            const alert: Omit<Alert, 'id'> = {
              deviceId: device.id,
              deviceName: device.name,
              type: 'gasLevel',
              value: device.gasLevel,
              threshold: device.gasLevel > device.thresholds.gasLevel.max
                ? device.thresholds.gasLevel.max
                : device.thresholds.gasLevel.min,
              message: device.gasLevel > device.thresholds.gasLevel.max
                ? `Gas level exceeded maximum threshold of ${device.thresholds.gasLevel.max} ppm`
                : `Gas level below minimum threshold of ${device.thresholds.gasLevel.min} ppm`,
              createdAt: now,
              acknowledged: false
            };
            
            try {
              await FirebaseService.addAlert(alert);
              activeAlerts.current.add(alertKey);
              console.log(`Created gas level alert for device ${device.name}`);
            } catch (error) {
              console.error('Error creating gas level alert:', error);
            }
          }
        } else {
          // Clear active alert if threshold is back to normal
          const alertKey = `${device.id}-gasLevel`;
          activeAlerts.current.delete(alertKey);
        }
        
        // Check location movement (only for online devices)
        if (device.status === 'online') {
          const previousLocation = previousLocations.current.get(device.id);
          if (previousLocation) {
            // Calculate distance moved
            const distance = calculateDistance(
              previousLocation.lat,
              previousLocation.lon,
              device.latitude,
              device.longitude
            );
            
            // Check if device moved more than 5 meters
            if (distance > 5) {
              const alertKey = `${device.id}-location`;
              if (!activeAlerts.current.has(alertKey)) {
                // Create location alert
                const alert: Omit<Alert, 'id'> = {
                  deviceId: device.id,
                  deviceName: device.name,
                  type: 'location',
                  value: distance,
                  threshold: 5, // 5 meters threshold
                  message: `Device moved ${distance.toFixed(2)} meters from its previous location`,
                  createdAt: now,
                  acknowledged: false
                };
                
                try {
                  await FirebaseService.addAlert(alert);
                  activeAlerts.current.add(alertKey);
                  console.log(`Created location alert for device ${device.name}`);
                } catch (error) {
                  console.error('Error creating location alert:', error);
                }
              }
            }
          }
          
          // Update previous location
          previousLocations.current.set(device.id, {
            lat: device.latitude,
            lon: device.longitude
          });
        }
      }
    };

    // Check thresholds whenever devices change
    if (devices.length > 0) {
      checkThresholdsAndGenerateAlerts();
    }
  }, [devices]);
}