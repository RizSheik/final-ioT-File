import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Device, Alert } from '@/types/device';

export class FirebaseService {
  // Devices Collection
  static async getDevices(): Promise<Device[]> {
    try {
      const devicesRef = collection(db, 'devices');
      const snapshot = await getDocs(devicesRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
      })) as Device[];
    } catch (error) {
      console.error('Error fetching devices:', error);
      return [];
    }
  }

  static async addDevice(device: Omit<Device, 'id'>): Promise<string> {
    try {
      const devicesRef = collection(db, 'devices');
      const docRef = await addDoc(devicesRef, {
        ...device,
        lastUpdated: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding device:', error);
      throw error;
    }
  }

  static async updateDevice(deviceId: string, updates: Partial<Device>): Promise<void> {
    try {
      const deviceRef = doc(db, 'devices', deviceId);
      await updateDoc(deviceRef, {
        ...updates,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  }

  static async deleteDevice(deviceId: string): Promise<void> {
    try {
      const deviceRef = doc(db, 'devices', deviceId);
      await deleteDoc(deviceRef);
    } catch (error) {
      console.error('Error deleting device:', error);
      throw error;
    }
  }

  // Alerts Collection
  static async getAlerts(): Promise<Alert[]> {
    try {
      const alertsRef = collection(db, 'alerts');
      const q = query(alertsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        acknowledgedAt: doc.data().acknowledgedAt?.toDate()
      })) as Alert[];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }

  static async addAlert(alert: Omit<Alert, 'id'>): Promise<string> {
    try {
      const alertsRef = collection(db, 'alerts');
      const docRef = await addDoc(alertsRef, alert);
      return docRef.id;
    } catch (error) {
      console.error('Error adding alert:', error);
      throw error;
    }
  }

  static async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      const alertRef = doc(db, 'alerts', alertId);
      await updateDoc(alertRef, {
        acknowledged: true,
        acknowledgedAt: new Date()
      });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }

  static async deleteAlert(alertId: string): Promise<void> {
    try {
      const alertRef = doc(db, 'alerts', alertId);
      await deleteDoc(alertRef);
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  }

  // Real-time listeners
  static subscribeToDevices(callback: (devices: Device[]) => void) {
    const devicesRef = collection(db, 'devices');
    return onSnapshot(devicesRef, (snapshot) => {
      const devices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
      })) as Device[];
      callback(devices);
    });
  }

  static subscribeToAlerts(callback: (alerts: Alert[]) => void) {
    const alertsRef = collection(db, 'alerts');
    const q = query(alertsRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        acknowledgedAt: doc.data().acknowledgedAt?.toDate()
      })) as Alert[];
      callback(alerts);
    });
  }
}
