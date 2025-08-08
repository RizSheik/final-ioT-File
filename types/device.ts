export interface Device {
  id: string;
  name: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  gasLevel: number;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline';
  lastUpdated: Date;
  thresholds: {
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
    windSpeed: { min: number; max: number };
    gasLevel: { min: number; max: number };
  };
}

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'temperature' | 'humidity' | 'windSpeed' | 'gasLevel' | 'location';
  value: number;
  threshold: number;
  message: string;
  createdAt: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
}
