"use client";

import { useEffect, useRef } from "react";
import { useSafeFirebaseData } from "@/hooks/use-safe-firebase-data";
import { toast } from "@/hooks/use-toast";

export function AlarmSystem() {
  const { alerts } = useSafeFirebaseData();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAlertRef = useRef<string | null>(null);

  useEffect(() => {
    // Create audio context for alarm sound
    if (typeof window !== 'undefined' && !(window as any).alarmAudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      (window as any).alarmAudioContext = audioContext;
    }
  }, []);

  useEffect(() => {
    const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
    const latestAlert = unacknowledgedAlerts[0];
    
    if (latestAlert && latestAlert.id !== lastAlertRef.current) {
      // Check if this is a new alert (created in the last 10 seconds)
      const now = new Date();
      const alertTime = new Date(latestAlert.createdAt);
      const timeDiff = now.getTime() - alertTime.getTime();
      
      if (timeDiff < 10000) { // 10 seconds
        // Check if alarm sound is enabled in settings
        const savedSettings = localStorage.getItem('systemSettings');
        let alarmSoundEnabled = true; // Default to true
        
        if (savedSettings) {
          try {
            const settings = JSON.parse(savedSettings);
            alarmSoundEnabled = settings.notifications?.alarmSound ?? true;
          } catch (error) {
            console.error('Failed to parse settings:', error);
          }
        }

        // Play alarm sound only if enabled
        if (alarmSoundEnabled) {
          // Use Web Audio API to play sound
          const audioContext = (window as any).alarmAudioContext;
          
          if (audioContext) {
            // Resume audio context if suspended
            if (audioContext.state === 'suspended') {
              audioContext.resume();
            }
            
            // Create new oscillator and gain node for this playback
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Set values for this playback
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.8, audioContext.currentTime); // Increased from 0.3 to 0.8
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            // Start and stop oscillator
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
          }
        }

        // Show critical toast notification
        toast({
          title: "🚨 CRITICAL THRESHOLD BREACH",
          description: (
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0">
                {latestAlert.type === 'temperature' && '🌡️'}
                {latestAlert.type === 'humidity' && '💧'}
                {latestAlert.type === 'windSpeed' && '💨'}
                {latestAlert.type === 'gasLevel' && '⚡'}
              </div>
              <div>
                <p className="font-semibold text-white">{latestAlert.deviceName}</p>
                <p className="text-sm text-red-100">{latestAlert.message}</p>
                <p className="text-xs text-red-200 mt-1">
                  Triggered at: {latestAlert.createdAt.toLocaleTimeString()}
                </p>
                <p className="text-xs text-red-200 mt-1">
                  Immediate attention required!
                </p>
              </div>
            </div>
          ),
          variant: "destructive",
          duration: 15000,
        });

        // Update last alert reference
        lastAlertRef.current = latestAlert.id;
      }
    }
  }, [alerts]);

  return null;
}
