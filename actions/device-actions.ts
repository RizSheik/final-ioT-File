"use server";

import { FirebaseService } from "@/lib/firebase-service";
import { Device } from "@/types/device";

export async function addDevice(deviceData: Omit<Device, 'id' | 'lastUpdated'>) {
  try {
    await FirebaseService.addDevice({ ...deviceData, lastUpdated: new Date() });
    return { success: true };
  } catch (error) {
    console.error('Error adding device:', error);
    return { success: false, error: 'Failed to add device' };
  }
}