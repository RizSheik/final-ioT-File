-- This script creates sample data for the Firebase Firestore database
-- Note: This is a representation of the data structure. 
-- In Firebase, you would create these documents through the Firebase console or SDK

-- Sample Devices Collection
-- Collection: devices
-- Document ID: device1
{
  "name": "ET",
  "temperature": 0,
  "humidity": 0,
  "windSpeed": 0,
  "gasLevel": 0,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "status": "offline",
  "lastUpdated": "2024-01-08T12:00:00Z",
  "thresholds": {
    "temperature": {"min": -10, "max": 50},
    "humidity": {"min": 0, "max": 100},
    "windSpeed": {"min": 0, "max": 30},
    "gasLevel": {"min": 0, "max": 1000}
  }
}

-- Document ID: device2
{
  "name": "TestDevice742",
  "temperature": 24,
  "humidity": 47,
  "windSpeed": 32,
  "gasLevel": 0,
  "latitude": 40.7589,
  "longitude": -73.9851,
  "status": "online",
  "lastUpdated": "2024-01-08T12:00:00Z",
  "thresholds": {
    "temperature": {"min": 20, "max": 30},
    "humidity": {"min": 20, "max": 80},
    "windSpeed": {"min": 0, "max": 25},
    "gasLevel": {"min": 0, "max": 500}
  }
}

-- Document ID: device3
{
  "name": "TD 5",
  "temperature": 0,
  "humidity": 20,
  "windSpeed": 45,
  "gasLevel": 0,
  "latitude": 40.6892,
  "longitude": -74.0445,
  "status": "offline",
  "lastUpdated": "2024-01-08T12:00:00Z",
  "thresholds": {
    "temperature": {"min": 0, "max": 40},
    "humidity": {"min": 0, "max": 90},
    "windSpeed": {"min": 0, "max": 40},
    "gasLevel": {"min": 0, "max": 800}
  }
}

-- Sample Alerts Collection
-- Collection: alerts
-- Document ID: alert1
{
  "deviceId": "device2",
  "deviceName": "TestDevice742",
  "type": "windSpeed",
  "value": 32,
  "threshold": 25,
  "message": "Wind speed exceeded threshold: 32 m/s > 25 m/s",
  "createdAt": "2024-01-08T12:00:00Z",
  "acknowledged": false
}
