"use client";

import { useEffect, useRef } from "react";
import { useSafeFirebaseData } from "@/hooks/use-safe-firebase-data";
import { toast } from "@/hooks/use-toast";

export function AlertNotification() {
  const { alerts } = useSafeFirebaseData();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAlertRef = useRef<string | null>(null);

  useEffect(() => {
    // Create audio element for alert sound
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio();
      // Using the same data URL for a simple beep sound as in alarm-system.tsx
      audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eeyw';
      audioRef.current.volume = 1.0; // Increased from 0.5 to 1.0
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
      });
    }
  }, []);

  useEffect(() => {
    // Get the latest unacknowledged alert
    const latestAlert = alerts.filter(alert => !alert.acknowledged)[0];
    
    if (latestAlert && latestAlert.id !== lastAlertRef.current) {
      // Check if this alert was created in the last 5 seconds (new alert)
      const now = new Date();
      const alertTime = new Date(latestAlert.createdAt);
      const timeDiff = now.getTime() - alertTime.getTime();
      
      if (timeDiff < 5000) { // 5 seconds
        // Check if notification sound is enabled in settings
        const savedSettings = localStorage.getItem('notificationSettings');
        let soundEnabled = true; // Default to true
        
        if (savedSettings) {
          try {
            const settings = JSON.parse(savedSettings);
            soundEnabled = settings.soundEnabled ?? true;
          } catch (error) {
            console.error('Failed to parse notification settings:', error);
          }
        }

        // Play notification sound only if enabled
        if (soundEnabled && audioRef.current) {
          audioRef.current.play().catch(console.error);
        }

        const getIcon = () => {
          switch (latestAlert.type) {
            case 'temperature':
              return '🌡️';
            case 'humidity':
              return '💧';
            case 'windSpeed':
              return '💨';
            case 'gasLevel':
              return '⚡';
            default:
              return '⚠️';
          }
        };

        toast({
          title: `${getIcon()} THRESHOLD ALERT`,
          description: (
            <div>
              <p className="font-semibold">{latestAlert.deviceName}</p>
              <p className="text-sm">{latestAlert.message}</p>
            </div>
          ),
          variant: "destructive",
          duration: 10000,
        });

        // Update last alert reference
        lastAlertRef.current = latestAlert.id;
      }
    }
  }, [alerts]);

  return null;
}
