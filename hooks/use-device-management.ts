import { useState, useEffect, useCallback, useRef } from 'react';
import { Device, Alert } from '@/types/device';
import { FirebaseService } from '@/lib/firebase-service';

export function useDeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const statusUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize data with real Firebase service
  useEffect(() => {
    let devicesUnsubscribe: (() => void) | undefined;
    let alertsUnsubscribe: (() => void) | undefined;

    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Use real Firebase service for devices
        devicesUnsubscribe = FirebaseService.subscribeToDevices((devices) => {
          setDevices(devices);
          setLoading(false);
        });

        // Use real Firebase service for alerts
        alertsUnsubscribe = FirebaseService.subscribeToAlerts((alerts) => {
          setAlerts(alerts);
        });

      } catch (err) {
        console.error('Error initializing Firebase data:', err);
        setLoading(false);
      }
    };

    initializeData();

    return () => {
      if (devicesUnsubscribe) devicesUnsubscribe();
      if (alertsUnsubscribe) alertsUnsubscribe();
      // Clear status update timer if it exists
      if (statusUpdateTimerRef.current) {
        clearInterval(statusUpdateTimerRef.current);
      }
    };
  }, []);

  // Automatically update device status based on last update time
  const updateDeviceStatusAutomatically = useCallback(async () => {
    const now = new Date();
    const offlineThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    for (const device of devices) {
      // Check if device is online but hasn't been updated in the last 5 minutes
      if (device.status === 'online' && now.getTime() - device.lastUpdated.getTime() > offlineThreshold) {
        try {
          await FirebaseService.updateDevice(device.id, { status: 'offline' });
        } catch (error) {
          console.error(`Error updating status for device ${device.id}:`, error);
        }
      }
      // Check if device is offline but has been updated recently (within last 5 minutes)
      else if (device.status === 'offline' && now.getTime() - device.lastUpdated.getTime() <= offlineThreshold) {
        try {
          await FirebaseService.updateDevice(device.id, { status: 'online' });
        } catch (error) {
          console.error(`Error updating status for device ${device.id}:`, error);
        }
      }
    }
  }, [devices]);

  // Set up interval to automatically update device statuses
  useEffect(() => {
    // Run immediately on mount and whenever devices change
    updateDeviceStatusAutomatically();
    
    // Set up interval to check status every minute
    statusUpdateTimerRef.current = setInterval(() => {
      updateDeviceStatusAutomatically();
    }, 60 * 1000); // 1 minute
    
    return () => {
      if (statusUpdateTimerRef.current) {
        clearInterval(statusUpdateTimerRef.current);
      }
    };
  }, [updateDeviceStatusAutomatically]);

  // Add new device using Firebase
  const addDevice = useCallback(async (deviceData: Omit<Device, 'id' | 'lastUpdated'>) => {
    try {
      await FirebaseService.addDevice({ ...deviceData, lastUpdated: new Date() });
    } catch (error) {
      console.error('Error adding device:', error);
      throw error;
    }
  }, []);

  // Remove device using Firebase
  const removeDevice = useCallback(async (deviceId: string) => {
    try {
      await FirebaseService.deleteDevice(deviceId);
    } catch (error) {
      console.error('Error removing device:', error);
      throw error;
    }
  }, []);

  // Update device using Firebase
  const updateDevice = useCallback(async (deviceId: string, updates: Partial<Device>) => {
    try {
      await FirebaseService.updateDevice(deviceId, updates);
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  }, []);

  // Acknowledge alert using Firebase
  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      await FirebaseService.acknowledgeAlert(alertId);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }, []);

  // Refresh alerts manually
  const refreshAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const freshAlerts = await FirebaseService.getAlerts();
      setAlerts(freshAlerts);
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing alerts:', error);
      setLoading(false);
    }
  }, []);

  // Clear all acknowledged alerts using Firebase
  const clearAcknowledgedAlerts = useCallback(async () => {
    try {
      // Get all alerts
      const allAlerts = await FirebaseService.getAlerts();
      // Filter acknowledged alerts
      const acknowledgedAlerts = allAlerts.filter(alert => alert.acknowledged);
      // Delete each acknowledged alert
      for (const alert of acknowledgedAlerts) {
        await FirebaseService.deleteAlert(alert.id);
      }
    } catch (error) {
      console.error('Error clearing acknowledged alerts:', error);
      throw error;
    }
  }, []);

  return {
    devices,
    alerts,
    loading,
    addDevice,
    removeDevice,
    updateDevice,
    acknowledgeAlert,
    refreshAlerts,
    clearAcknowledgedAlerts
  };
}
