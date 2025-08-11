import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Device, Alert } from '@/types/device';

// Ensure db is properly initialized
if (!db) {
  console.error('FirebaseService: Firestore not properly initialized');
}

export class FirebaseService {
  // Add a method to check and fix common Firebase issues
  static async checkAndFixIssues() {
    try {
      // Check if db is properly initialized
      if (!db) {
        console.warn('FirebaseService: Firestore not properly initialized, attempting to reinitialize');
        // In a real scenario, we might want to reinitialize Firebase here
        // For now, we'll just log the issue
        return { success: false, error: 'Firestore not initialized' };
      }
      
      // Test connection by trying to get a small amount of data
      const testRef = collection(db, 'devices');
      const testSnapshot = await getDocs(testRef);
      
      console.log('FirebaseService: Connection test successful, documents count:', testSnapshot.size);
      return { success: true, message: 'Connection test successful' };
    } catch (error) {
      console.error('FirebaseService: Connection test failed:', error);
      // Try to handle common issues
      if (error instanceof Error) {
        // Handle network issues
        if (error.message.includes('network') || error.message.includes('timeout')) {
          console.log('FirebaseService: Network issue detected, suggesting retry');
          return { success: false, error: 'Network issue, please check connection', retryable: true };
        }
        
        // Handle permission issues
        if (error.message.includes('permission')) {
          console.log('FirebaseService: Permission issue detected');
          return { success: false, error: 'Permission denied, please check Firebase rules', retryable: false };
        }
      }
      
      return { success: false, error: 'Unknown error occurred', retryable: true };
    }
  }

  // Add a retry mechanism for Firebase operations
  static async retryOperation<T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.warn(`FirebaseService: Operation failed, retry ${i + 1}/${maxRetries}`, error);
        
        if (i < maxRetries - 1) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  }
  // Devices Collection
  static async getDevices(): Promise<Device[]> {
    try {
      return await this.retryOperation(async () => {
        const devicesRef = collection(db, 'devices');
        const snapshot = await getDocs(devicesRef);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
        })) as Device[];
      });
    } catch (error) {
      console.error('Error fetching devices:', error);
      return [];
    }
  }

  static async addDevice(device: Omit<Device, 'id'>): Promise<string> {
    try {
      return await this.retryOperation(async () => {
        const devicesRef = collection(db, 'devices');
        const docRef = await addDoc(devicesRef, {
          ...device,
          lastUpdated: new Date()
        });
        return docRef.id;
      });
    } catch (error) {
      console.error('Error adding device:', error);
      throw error;
    }
  }

  static async updateDevice(deviceId: string, updates: Partial<Device>): Promise<void> {
    try {
      return await this.retryOperation(async () => {
        const deviceRef = doc(db, 'devices', deviceId);
        await updateDoc(deviceRef, {
          ...updates,
          lastUpdated: new Date()
        });
      });
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  }

  static async deleteDevice(deviceId: string): Promise<void> {
    try {
      return await this.retryOperation(async () => {
        const deviceRef = doc(db, 'devices', deviceId);
        await deleteDoc(deviceRef);
      });
    } catch (error) {
      console.error('Error deleting device:', error);
      throw error;
    }
  }

  // Alerts Collection
  static async getAlerts(): Promise<Alert[]> {
    try {
      return await this.retryOperation(async () => {
        const alertsRef = collection(db, 'alerts');
        const q = query(alertsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          acknowledgedAt: doc.data().acknowledgedAt?.toDate()
        })) as Alert[];
      });
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }

  static async addAlert(alert: Omit<Alert, 'id'>): Promise<string> {
    try {
      return await this.retryOperation(async () => {
        const alertsRef = collection(db, 'alerts');
        const docRef = await addDoc(alertsRef, alert);
        return docRef.id;
      });
    } catch (error) {
      console.error('Error adding alert:', error);
      throw error;
    }
  }

  static async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      return await this.retryOperation(async () => {
        const alertRef = doc(db, 'alerts', alertId);
        await updateDoc(alertRef, {
          acknowledged: true,
          acknowledgedAt: new Date()
        });
      });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }

  static async deleteAlert(alertId: string): Promise<void> {
    try {
      return await this.retryOperation(async () => {
        const alertRef = doc(db, 'alerts', alertId);
        await deleteDoc(alertRef);
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  }

  // Real-time listeners
  static subscribeToDevices(callback: (devices: Device[]) => void) {
    console.log('FirebaseService: Subscribing to devices');
    const devicesRef = collection(db, 'devices');
    
    // Set up error recovery mechanism
    let retryCount = 0;
    const maxRetries = 3;
    
    const setupSubscription = () => {
      return onSnapshot(devicesRef, (snapshot) => {
        console.log('FirebaseService: Devices snapshot received', snapshot.size);
        const devices = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
        })) as Device[];
        console.log('FirebaseService: Processed devices', devices.length);
        callback(devices);
        // Reset retry count on successful snapshot
        retryCount = 0;
      }, (error) => {
        console.error('FirebaseService: Error in devices subscription', error);
        // Implement retry mechanism for subscription errors
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`FirebaseService: Retrying subscription (${retryCount}/${maxRetries})`);
          setTimeout(setupSubscription, 1000 * retryCount); // Exponential backoff
        } else {
          console.error('FirebaseService: Max retries reached for subscription');
        }
      });
    };
    
    return setupSubscription();
  }

  static subscribeToAlerts(callback: (alerts: Alert[]) => void) {
    const alertsRef = collection(db, 'alerts');
    const q = query(alertsRef, orderBy('createdAt', 'desc'));
    
    // Set up error recovery mechanism
    let retryCount = 0;
    const maxRetries = 3;
    
    const setupSubscription = () => {
      return onSnapshot(q, (snapshot) => {
        const alerts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          acknowledgedAt: doc.data().acknowledgedAt?.toDate()
        })) as Alert[];
        callback(alerts);
        // Reset retry count on successful snapshot
        retryCount = 0;
      }, (error) => {
        console.error('FirebaseService: Error in alerts subscription', error);
        // Implement retry mechanism for subscription errors
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`FirebaseService: Retrying alerts subscription (${retryCount}/${maxRetries})`);
          setTimeout(setupSubscription, 1000 * retryCount); // Exponential backoff
        } else {
          console.error('FirebaseService: Max retries reached for alerts subscription');
        }
      });
    };
    
    return setupSubscription();
  }
}
