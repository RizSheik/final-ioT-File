"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeviceManagement } from "@/hooks/use-device-management";
import { toast } from "@/hooks/use-toast";

export default function AlertsPage() {
  const { alerts, loading, acknowledgeAlert, refreshAlerts, clearAcknowledgedAlerts } = useDeviceManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || alert.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "acknowledged" && alert.acknowledged) ||
                         (statusFilter === "unacknowledged" && !alert.acknowledged);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAcknowledgeAlert = (alertId: string) => {
    acknowledgeAlert(alertId);
    toast({
      title: "Alert Acknowledged",
      description: "The alert has been marked as acknowledged.",
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
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

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'temperature':
        return 'bg-red-100 text-red-800';
      case 'humidity':
        return 'bg-blue-100 text-blue-800';
      case 'windSpeed':
        return 'bg-gray-100 text-gray-800';
      case 'gasLevel':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Real-Time Alerts</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="destructive" className="animate-pulse">
            {alerts.filter(a => !a.acknowledged).length} Active Alerts
          </Badge>
          <Badge variant="outline" className="text-sm">
            {alerts.length} Total Alerts
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Alert Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="temperature">🌡️ Temperature</SelectItem>
                <SelectItem value="humidity">💧 Humidity</SelectItem>
                <SelectItem value="windSpeed">💨 Wind Speed</SelectItem>
                <SelectItem value="gasLevel">⚡ Gas Level</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="w-full" onClick={refreshAlerts}>
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
            <Button
              className="w-full"
              onClick={async () => {
                try {
                  await clearAcknowledgedAlerts();
                  toast({
                    title: "Acknowledged Alerts Cleared",
                    description: "All acknowledged alerts have been cleared.",
                  });
                  // Refresh the alerts after clearing
                  await refreshAlerts();
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to clear acknowledged alerts. Please try again.",
                    variant: "destructive"
                  });
                }
              }}
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Acknowledged
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts Summary */}
      {alerts.filter(a => !a.acknowledged).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <svg className="h-5 w-5 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Critical Alerts Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alerts.filter(a => !a.acknowledged).slice(0, 6).map((alert) => (
                <div key={alert.id} className="bg-white p-4 rounded-lg border border-red-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getAlertIcon(alert.type)}</span>
                      <div>
                        <p className="font-semibold text-sm">{alert.deviceName}</p>
                        <p className="text-xs text-gray-600">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.createdAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      className="text-xs"
                    >
                      ✓
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alert History & Management</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8">
              <svg className="h-12 w-12 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-muted-foreground">No alerts found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Type</th>
                    <th className="text-left py-3">Device</th>
                    <th className="text-left py-3">Message</th>
                    <th className="text-left py-3">Value</th>
                    <th className="text-left py-3">Threshold</th>
                    <th className="text-left py-3">Created</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.map((alert) => (
                    <tr key={alert.id} className={`border-b hover:bg-gray-50 ${!alert.acknowledged ? 'bg-red-50' : ''}`}>
                      <td className="py-3">
                        <Badge className={`text-xs ${getAlertColor(alert.type)}`}>
                          {getAlertIcon(alert.type)} {alert.type.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      </td>
                      <td className="py-3 font-medium">{alert.deviceName}</td>
                      <td className="py-3 max-w-xs">
                        <div className="truncate" title={alert.message}>
                          {alert.message}
                        </div>
                      </td>
                      <td className="py-3 font-mono text-sm">
                        <span className="font-semibold text-red-600">
                          {alert.value}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-sm">
                        {alert.threshold}
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {alert.createdAt.toLocaleString()}
                      </td>
                      <td className="py-3">
                        {alert.acknowledged ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Acknowledged
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="animate-pulse">
                            Active
                          </Badge>
                        )}
                      </td>
                      <td className="py-3">
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Acknowledge
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
