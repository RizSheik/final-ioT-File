import { useState, useEffect, useCallback } from 'react';
import { Device, Alert } from '@/types/device';
import { FirebaseService } from '@/lib/firebase-service';

export function useSafeFirebaseData() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'fallback'>('connecting');

  // Initialize data with real Firebase service
  useEffect(() => {
    let devicesUnsubscribe: (() => void) | undefined;
    let alertsUnsubscribe: (() => void) | undefined;

    const initializeData = async () => {
      try {
        setLoading(true);
        setConnectionStatus('connecting');
        
        console.log('Using real Firebase data service');
        
        // Use real Firebase service
        devicesUnsubscribe = FirebaseService.subscribeToDevices((devices) => {
          setDevices(devices);
          setLoading(false);
          setConnectionStatus('connected');
        });

        alertsUnsubscribe = FirebaseService.subscribeToAlerts((alerts) => {
          setAlerts(alerts);
        });

      } catch (err) {
        console.error('Error initializing Firebase data:', err);
        setError('Failed to initialize data');
        setConnectionStatus('fallback');
        setLoading(false);
      }
    };

    initializeData();

    return () => {
      if (devicesUnsubscribe) devicesUnsubscribe();
      if (alertsUnsubscribe) alertsUnsubscribe();
    };
  }, []);

  // Device management functions with real Firebase
  const addDevice = useCallback(async (deviceData: Omit<Device, 'id' | 'lastUpdated'>) => {
    try {
      await FirebaseService.addDevice({ ...deviceData, lastUpdated: new Date() });
    } catch (error) {
      console.error('Error adding device:', error);
      throw error;
    }
  }, []);

  const updateDevice = useCallback(async (deviceId: string, updates: Partial<Device>) => {
    try {
      await FirebaseService.updateDevice(deviceId, updates);
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  }, []);

  const removeDevice = useCallback(async (deviceId: string) => {
    try {
      await FirebaseService.deleteDevice(deviceId);
    } catch (error) {
      console.error('Error removing device:', error);
      throw error;
    }
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      await FirebaseService.acknowledgeAlert(alertId);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }, []);

  return {
    devices,
    alerts,
    loading,
    error,
    connectionStatus,
    addDevice,
    updateDevice,
    removeDevice,
    acknowledgeAlert
  };
}
