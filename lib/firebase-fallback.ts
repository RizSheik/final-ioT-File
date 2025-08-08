import { Device, Alert } from '@/types/device';

// Mock data for when Firebase is not available
const mockDevices: Device[] = [
  {
    id: "device1",
    name: "ET",
    temperature: 22.5,
    humidity: 45,
    windSpeed: 12.3,
    gasLevel: 150,
    latitude: 40.7128,
    longitude: -74.0060,
    status: 'online',
    lastUpdated: new Date(),
    thresholds: {
      temperature: { min: -10, max: 50 },
      humidity: { min: 0, max: 100 },
      windSpeed: { min: 0, max: 30 },
      gasLevel: { min: 0, max: 1000 }
    }
  },
  {
    id: "device2",
    name: "TestDevice742",
    temperature: 28.7,
    humidity: 67,
    windSpeed: 35.2,
    gasLevel: 89,
    latitude: 40.7589,
    longitude: -73.9851,
    status: 'online',
    lastUpdated: new Date(),
    thresholds: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 20, max: 80 },
      windSpeed: { min: 0, max: 25 },
      gasLevel: { min: 0, max: 500 }
    }
  },
  {
    id: "device3",
    name: "TD 5",
    temperature: 15.2,
    humidity: 32,
    windSpeed: 45.8,
    gasLevel: 234,
    latitude: 40.6892,
    longitude: -74.0445,
    status: 'offline',
    lastUpdated: new Date(),
    thresholds: {
      temperature: { min: 0, max: 40 },
      humidity: { min: 0, max: 90 },
      windSpeed: { min: 0, max: 40 },
      gasLevel: { min: 0, max: 800 }
    }
  },
  {
    id: "device4",
    name: "Weather Station Alpha",
    temperature: 24.1,
    humidity: 58,
    windSpeed: 18.7,
    gasLevel: 67,
    latitude: 40.6782,
    longitude: -73.9442,
    status: 'online',
    lastUpdated: new Date(),
    thresholds: {
      temperature: { min: 0, max: 35 },
      humidity: { min: 0, max: 85 },
      windSpeed: { min: 0, max: 35 },
      gasLevel: { min: 0, max: 600 }
    }
  }
];

const mockAlerts: Alert[] = [
  {
    id: "alert1",
    deviceId: "device2",
    deviceName: "TestDevice742",
    type: 'windSpeed',
    value: 35.2,
    threshold: 25,
    message: "Wind speed exceeded threshold: 35.2 m/s > 25 m/s",
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    acknowledged: false
  },
  {
    id: "alert2",
    deviceId: "device3",
    deviceName: "TD 5",
    type: 'windSpeed',
    value: 45.8,
    threshold: 40,
    message: "Wind speed exceeded threshold: 45.8 m/s > 40 m/s",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    acknowledged: false
  }
];

export class FirebaseFallbackService {
  private static devices = [...mockDevices];
  private static alerts = [...mockAlerts];
  private static listeners: Array<(data: any) => void> = [];

  // Simulate Firebase methods
  static async getDevices(): Promise<Device[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.devices];
  }

  static async addDevice(device: Omit<Device, 'id'>): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newDevice: Device = {
      ...device,
      id: `device_${Date.now()}`,
      lastUpdated: new Date()
    };
    this.devices.push(newDevice);
    this.notifyListeners();
    return newDevice.id;
  }

  static async updateDevice(deviceId: string, updates: Partial<Device>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.devices.findIndex(d => d.id === deviceId);
    if (index !== -1) {
      this.devices[index] = { ...this.devices[index], ...updates, lastUpdated: new Date() };
      this.notifyListeners();
    }
  }

  static async deleteDevice(deviceId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.devices = this.devices.filter(d => d.id !== deviceId);
    this.alerts = this.alerts.filter(a => a.deviceId !== deviceId);
    this.notifyListeners();
  }

  static async getAlerts(): Promise<Alert[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.alerts];
  }

  static async acknowledgeAlert(alertId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.alerts.findIndex(a => a.id === alertId);
    if (index !== -1) {
      this.alerts[index] = {
        ...this.alerts[index],
        acknowledged: true,
        acknowledgedAt: new Date()
      };
    }
  }

  // Simulate real-time updates
  static subscribeToDevices(callback: (devices: Device[]) => void) {
    this.listeners.push(callback);
    
    // Initial data
    callback([...this.devices]);
    
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      this.devices = this.devices.map(device => {
        if (device.status === 'online') {
          return {
            ...device,
            temperature: Math.round((device.temperature + (Math.random() - 0.5) * 2) * 10) / 10,
            humidity: Math.max(0, Math.min(100, device.humidity + (Math.random() - 0.5) * 5)),
            windSpeed: Math.max(0, Math.round((device.windSpeed + (Math.random() - 0.5) * 3) * 10) / 10),
            gasLevel: Math.max(0, device.gasLevel + Math.round((Math.random() - 0.5) * 20)),
            lastUpdated: new Date()
          };
        }
        return device;
      });
      callback([...this.devices]);
    }, 5000);

    // Return unsubscribe function
    return () => {
      clearInterval(interval);
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  static subscribeToAlerts(callback: (alerts: Alert[]) => void) {
    callback([...this.alerts]);
    return () => {}; // Return empty unsubscribe function
  }

  private static notifyListeners() {
    this.listeners.forEach(listener => listener([...this.devices]));
  }
}
