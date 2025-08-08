"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Device } from "@/types/device";
import { addDevice } from "@/actions/device-actions";

interface AddDeviceDialogProps {
}

export function AddDeviceDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    temperature: "",
    humidity: "",
    windSpeed: "",
    gasLevel: "",
    tempMin: "",
    tempMax: "",
    humidityMin: "",
    humidityMax: "",
    windMin: "",
    windMax: "",
    gasMin: "",
    gasMax: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.name || !formData.latitude || !formData.longitude) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    const newDevice: Omit<Device, 'id' | 'lastUpdated'> = {
      name: formData.name,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      status: 'online', // Default to online, will be updated automatically based on device activity
      temperature: parseFloat(formData.temperature) || 0,
      humidity: parseFloat(formData.humidity) || 0,
      windSpeed: parseFloat(formData.windSpeed) || 0,
      gasLevel: parseFloat(formData.gasLevel) || 0,
      thresholds: {
        temperature: {
          min: parseFloat(formData.tempMin) || -10,
          max: parseFloat(formData.tempMax) || 50
        },
        humidity: {
          min: parseFloat(formData.humidityMin) || 0,
          max: parseFloat(formData.humidityMax) || 100
        },
        windSpeed: {
          min: parseFloat(formData.windMin) || 0,
          max: parseFloat(formData.windMax) || 30
        },
        gasLevel: {
          min: parseFloat(formData.gasMin) || 0,
          max: parseFloat(formData.gasMax) || 1000
        }
      }
    };

    try {
      const result = await addDevice(newDevice);
      
      if (result.success) {
        setOpen(false);
        setFormData({
          name: "",
          latitude: "",
          longitude: "",
          temperature: "",
          humidity: "",
          windSpeed: "",
          gasLevel: "",
          tempMin: "",
          tempMax: "",
          humidityMin: "",
          humidityMax: "",
          windMin: "",
          windMax: "",
          gasMin: "",
          gasMax: ""
        });

        toast({
          title: "Success",
          description: "Device added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add device. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding device:", error);
      toast({
        title: "Error",
        description: "Failed to add device. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Device
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white bg-opacity-90">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div>
              <Label htmlFor="name" className="flex items-center">
                Device Name
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter device name"
                required
                className={formData.name ? "" : "border-red-500"}
              />
              {!formData.name && (
                <p className="text-red-500 text-xs mt-1">Device name is required</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude" className="flex items-center">
                Latitude
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="40.7128"
                required
                className={formData.latitude ? "" : "border-red-500"}
              />
              {!formData.latitude && (
                <p className="text-red-500 text-xs mt-1">Latitude is required</p>
              )}
            </div>
            <div>
              <Label htmlFor="longitude" className="flex items-center">
                Longitude
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="-74.0060"
                required
                className={formData.longitude ? "" : "border-red-500"}
              />
              {!formData.longitude && (
                <p className="text-red-500 text-xs mt-1">Longitude is required</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Initial Sensor Values</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  placeholder="25.0"
                />
              </div>
              <div>
                <Label htmlFor="humidity">Humidity (%)</Label>
                <Input
                  id="humidity"
                  type="number"
                  value={formData.humidity}
                  onChange={handleInputChange}
                  placeholder="60"
                />
              </div>
              <div>
                <Label htmlFor="windSpeed">Wind Speed (m/s)</Label>
                <Input
                  id="windSpeed"
                  type="number"
                  step="0.1"
                  value={formData.windSpeed}
                  onChange={handleInputChange}
                  placeholder="5.0"
                />
              </div>
              <div>
                <Label htmlFor="gasLevel">Gas Level (ppm)</Label>
                <Input
                  id="gasLevel"
                  type="number"
                  value={formData.gasLevel}
                  onChange={handleInputChange}
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Threshold Settings</h3>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label htmlFor="tempMin">Temp Min</Label>
                <Input
                  id="tempMin"
                  type="number"
                  value={formData.tempMin}
                  onChange={handleInputChange}
                  placeholder="-10"
                />
              </div>
              <div>
                <Label htmlFor="tempMax">Temp Max</Label>
                <Input
                  id="tempMax"
                  type="number"
                  value={formData.tempMax}
                  onChange={handleInputChange}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="humidityMin">Humidity Min</Label>
                <Input
                  id="humidityMin"
                  type="number"
                  value={formData.humidityMin}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="humidityMax">Humidity Max</Label>
                <Input
                  id="humidityMax"
                  type="number"
                  value={formData.humidityMax}
                  onChange={handleInputChange}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="windMin">Wind Min</Label>
                <Input
                  id="windMin"
                  type="number"
                  value={formData.windMin}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="windMax">Wind Max</Label>
                <Input
                  id="windMax"
                  type="number"
                  value={formData.windMax}
                  onChange={handleInputChange}
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="gasMin">Gas Min</Label>
                <Input
                  id="gasMin"
                  type="number"
                  value={formData.gasMin}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="gasMax">Gas Max</Label>
                <Input
                  id="gasMax"
                  type="number"
                  value={formData.gasMax}
                  onChange={handleInputChange}
                  placeholder="1000"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Device"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}