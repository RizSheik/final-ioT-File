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
        console.log('useSafeFirebaseData: Starting data initialization');
        setLoading(true);
        setConnectionStatus('connecting');
        
        console.log('useSafeFirebaseData: Using real Firebase data service');
        
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          console.log('useSafeFirebaseData: Data loading timeout, using fallback');
          setLoading(false);
          setConnectionStatus('fallback');
        }, 10000); // 10 second timeout
        
        // Check if FirebaseService is properly initialized
        if (!FirebaseService) {
          console.error('useSafeFirebaseData: FirebaseService not properly initialized');
          clearTimeout(timeoutId);
          setLoading(false);
          setConnectionStatus('fallback');
          return;
        }
        
        // Use real Firebase service
        devicesUnsubscribe = FirebaseService.subscribeToDevices((devices) => {
          console.log('useSafeFirebaseData: Received devices update', devices.length);
          clearTimeout(timeoutId); // Clear timeout when data is received
          setDevices(devices);
          setLoading(false);
          setConnectionStatus('connected');
          console.log('useSafeFirebaseData: Data loading completed');
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

    // Set up periodic refresh every 5 seconds as requested
    const refreshInterval = setInterval(async () => {
      console.log('useSafeFirebaseData: Periodic data refresh triggered (every 5 seconds)');
      // The real-time listeners should already be handling updates,
      // but we keep this interval as requested for periodic refresh
      
      // Run auto-fix check
      try {
        const result = await FirebaseService.checkAndFixIssues();
        if (!result.success) {
          console.warn('useSafeFirebaseData: Auto-fix check failed:', result.error);
          if (result.retryable) {
            console.log('useSafeFirebaseData: Issue is retryable, will try again in next cycle');
          }
        } else {
          console.log('useSafeFirebaseData: Auto-fix check passed');
        }
      } catch (error) {
        console.error('useSafeFirebaseData: Error during auto-fix check:', error);
      }
    }, 5000); // 5 seconds

    return () => {
      if (devicesUnsubscribe) devicesUnsubscribe();
      if (alertsUnsubscribe) alertsUnsubscribe();
      clearInterval(refreshInterval); // Clean up interval on unmount
    };

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
