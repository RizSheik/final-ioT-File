"use client";

import { useEffect, useRef } from "react";
import { useSafeFirebaseData } from "@/hooks/use-safe-firebase-data";
import { toast } from "@/hooks/use-toast";

export function AlertNotification() {
  const { alerts } = useSafeFirebaseData();
  const lastAlertRef = useRef<string | null>(null);

  useEffect(() => {
    // Audio element is created directly in the playSound function
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
        if (soundEnabled) {
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Eeyw');
            audio.volume = 1.0; // Increased from 0.5 to 1.0
            audio.play().catch(console.error);
          } catch (error) {
            console.error('Audio playback error:', error);
          }
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
