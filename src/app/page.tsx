'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/hooks';
import { deviceService } from '@/features/devices/services';
import { sensorService } from '@/features/dashboard/services';
import { websocketClient } from '@/lib/websocket-client';
import { TemperatureChart, HumidityChart, LightChart, StatCard, DeviceCard } from '@/features/dashboard/components';
import { Thermometer, Droplets, Sun, Power, Activity } from 'lucide-react';
import type { Device, SensorData } from '@/types';
import '@/styles/dashboard.scss';

export default function Home() {
  const { data: devices = [] } = useData(() => deviceService.getDevices(), []);

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  const { data: latestSensor } = useData(
    () =>
      selectedDeviceId
        ? sensorService.getLatestSensorData(selectedDeviceId)
        : Promise.resolve(null),
    [selectedDeviceId]
  );

  const { data: stats } = useData(
    () =>
      selectedDeviceId
        ? sensorService.getSensorStatistics(selectedDeviceId)
        : Promise.resolve(null as any),
    [selectedDeviceId]
  );

  useEffect(() => {
    if (selectedDeviceId) {
      sensorService.getSensorData(selectedDeviceId, 20).then(setSensorData);
      
      // Subscribe to device via WebSocket
      websocketClient.subscribeToDevice(selectedDeviceId);
      
      // Subscribe to WebSocket for real-time sensor updates
      const unsubscribeSensor = websocketClient.subscribe('sensor-data', (message: any) => {
        if (message.deviceId === selectedDeviceId) {
          // Refresh sensor data when update received
          sensorService.getSensorData(selectedDeviceId, 20).then(setSensorData);
        }
      });

      // Get device dataInterval for polling
      const selectedDevice = (devices as Device[]).find((d: Device) => d.deviceId === selectedDeviceId);
      const pollInterval = selectedDevice?.dataInterval || 10000; // Default 10 seconds if not found

      // Auto-refresh sensor data based on device's dataInterval
      const interval = setInterval(() => {
        sensorService.getSensorData(selectedDeviceId, 20).then(setSensorData);
      }, pollInterval);

      return () => {
        websocketClient.unsubscribeFromDevice(selectedDeviceId);
        unsubscribeSensor();
        clearInterval(interval);
      };
    }
  }, [selectedDeviceId, devices]);

  const selectedDevice =
    devices && (devices as Device[]).length > 0
      ? (devices as Device[]).find((d: Device) => d.deviceId === selectedDeviceId)
      : null;

  return (
    <div className="dashboard-container">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="dashboard-header">
          <h1>IoT Dashboard</h1>
          <p>Real-time monitoring of your ESP32 sensors and devices</p>
        </div>

        {/* Device Selector Grid */}
        {devices && (devices as Device[]).length > 0 && (
          <div className="device-selector-section">
            <h2 className="section-title">
              <Activity size={20} />
              Your Devices
            </h2>
            <div className="device-cards-grid">
              {(devices as Device[]).map((device: Device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  isSelected={selectedDeviceId === device.deviceId}
                  onClick={() => setSelectedDeviceId(device.deviceId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {selectedDevice && latestSensor && (
          <div className="cards-grid">
            <StatCard
              icon={Thermometer}
              title="Temperature"
              value={latestSensor.temperature?.toFixed(1) || 'N/A'}
              unit="°C"
              color="orange"
              trend={
                stats && stats.avgTemperature ? (latestSensor.temperature! > stats.avgTemperature ? 'up' : 'down') : undefined
              }
            />
            <StatCard
              icon={Droplets}
              title="Humidity"
              value={latestSensor.humidity?.toFixed(1) || 'N/A'}
              unit="%"
              color="blue"
              trend={
                stats && stats.avgHumidity ? (latestSensor.humidity! > stats.avgHumidity ? 'up' : 'down') : undefined
              }
            />
            {latestSensor.light !== undefined && latestSensor.light !== null && (
              <StatCard
                icon={Sun}
                title="Light Intensity"
                value={latestSensor.light?.toFixed(1) || 'N/A'}
                unit="lux"
                color="yellow"
              />
            )}
            <StatCard
              icon={Power}
              title="Device Status"
              value={selectedDevice.isOnline ? 'Online' : 'Offline'}
              color={selectedDevice.isOnline ? 'green' : 'red'}
            />
          </div>
        )}

        {/* Charts Section */}
        {selectedDevice && sensorData && sensorData.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ color: '#ffffff', marginBottom: '16px', fontSize: '1.125rem', fontWeight: '600' }}>
              <Activity size={20} style={{ display: 'inline', marginRight: '8px' }} />
              Sensor Trends
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              <TemperatureChart data={sensorData} />
              <HumidityChart data={sensorData} />
              {sensorData.some((d) => d.light !== undefined && d.light !== null) && (
                <LightChart data={sensorData} />
              )}
            </div>
          </div>
        )}

        {/* Recent Readings Table */}
        {selectedDevice && (
          <div>
            <h2 style={{ color: '#ffffff', marginBottom: '16px', fontSize: '1.125rem', fontWeight: '600' }}>
              <Activity size={20} style={{ display: 'inline', marginRight: '8px' }} />
              Recent Readings
            </h2>
            <div className="data-table">
              <div className="table-header">
                <span>Timestamp</span>
                <span>Temperature</span>
                <span>Humidity</span>
                <span>Light</span>
                <span>Status</span>
              </div>
              <div className="table-rows">
                {sensorData && (sensorData as any[]).length > 0 ? (
                  (sensorData as any[]).map((reading: any, idx: number) => (
                    <div key={idx} className="table-row">
                      <span>{new Date(reading.timestamp).toLocaleString()}</span>
                      <span>{reading.temperature?.toFixed(1) || 'N/A'}°C</span>
                      <span>{reading.humidity?.toFixed(1) || 'N/A'}%</span>
                      <span>{reading.light?.toFixed(1) || 'N/A'} lux</span>
                      <span>✅ Recorded</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">No sensor data available</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hide select hint when devices exist; no UI needed here */}
      </div>
    </div>
  );
}
