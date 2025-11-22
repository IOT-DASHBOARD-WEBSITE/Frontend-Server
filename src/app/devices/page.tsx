'use client';

import { useState, useEffect } from 'react';
import { useDeviceContext } from '@/shared/contexts/DeviceContext';
import { deviceService } from '@/features/devices/services';
import { Edit2 } from 'lucide-react';
import type { Device } from '@/types';
import '@/styles/devices.scss';

export default function DevicesPage() {
  const { devices, refetchDevices } = useDeviceContext();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    description: '',
    wifiSSID: '',
    wifiPassword: '',
    dataInterval: '5000',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      deviceId: '',
      name: '',
      description: '',
      wifiSSID: '',
      wifiPassword: '',
      dataInterval: '5000',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update device - only WiFi and interval allowed
        await deviceService.updateDevice(editingId, {
          wifiSSID: formData.wifiSSID,
          wifiPassword: formData.wifiPassword,
          dataInterval: formData.dataInterval ? parseInt(formData.dataInterval) * 1000 : undefined,
        });
        setMessage({ type: 'success', text: 'Device updated successfully!' });
      } else {
        // Create new device
        await deviceService.createDevice({
          deviceId: formData.deviceId,
          name: formData.name,
          description: formData.description || undefined,
          wifiSSID: formData.wifiSSID || undefined,
          wifiPassword: formData.wifiPassword || undefined,
          dataInterval: parseInt(formData.dataInterval) * 1000,
        });
        setMessage({ type: 'success', text: 'Device registered successfully!' });
      }
      resetForm();
      await refetchDevices();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleEdit = (device: Device) => {
    setEditingId(device.id);
    setFormData({
      deviceId: device.deviceId,
      name: device.name,
      description: device.description || '',
      wifiSSID: device.wifiSSID || '',
      wifiPassword: device.wifiPassword || '',
      dataInterval: (device.dataInterval / 1000).toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (deviceId: string) => {
    if (!confirm('Are you sure you want to delete this device?')) return;

    console.log('Deleting device with ID:', deviceId);
    try {
      const result = await deviceService.deleteDevice(deviceId);
      console.log('Delete result:', result);
      setMessage({ type: 'success', text: 'Device deleted successfully!' });
      await refetchDevices();
    } catch (error: any) {
      console.error('Delete error:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="devices-container">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="devices-header">
          <h1>Device Management</h1>
          <p>Register and manage your IoT devices</p>
        </div>

        {/* Alert Message */}
        {message && (
          <div className={`alert ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Controls - Devices are auto-created from Adafruit, no manual creation needed */}
        {/* <div className="devices-controls">
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            {showForm ? 'Cancel' : '+ Add Device'}
          </button>
        </div> */}

        {/* Device Form - Only for editing WiFi and interval */}
        {showForm && editingId && (
          <div className={`device-form show`}>
            <form onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: '24px', color: '#1f2937' }}>
                Configure Device Settings
              </h3>
              
              <div className="form-grid">
                {/* Read-only device info */}
                <div className="form-group">
                  <label>Device ID</label>
                  <input
                    type="text"
                    value={formData.deviceId}
                    disabled
                    style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label>Device Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    disabled
                    style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                  />
                </div>

                {/* Editable fields */}
                <div className="form-group">
                  <label>WiFi SSID</label>
                  <input
                    type="text"
                    name="wifiSSID"
                    value={formData.wifiSSID}
                    onChange={handleInputChange}
                    placeholder="e.g., HomeWiFi"
                  />
                </div>

                <div className="form-group">
                  <label>WiFi Password</label>
                  <input
                    type="password"
                    name="wifiPassword"
                    value={formData.wifiPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                  />
                </div>

                <div className="form-group">
                  <label>Data Interval (seconds)</label>
                  <input
                    type="number"
                    name="dataInterval"
                    value={formData.dataInterval}
                    onChange={handleInputChange}
                    placeholder="e.g., 15"
                    min="1"
                    step="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    disabled
                    style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Settings'}
                </button>
                <button type="button" className="cancel" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Devices Grid */}
        {devices && devices.length > 0 ? (
          <div className="devices-grid">
            {devices.map((device: Device) => (
              <div key={device.id} className="device-card">
                <div className="device-header">
                  <div className="device-info">
                    <h3>{device.name || device.deviceId}</h3>
                    <p>{device.deviceId}</p>
                  </div>
                  <span className={`status-badge ${device.isOnline ? 'online' : 'offline'}`}>
                    {device.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>

                <div className="device-details">
                  <p>
                    <strong>Description:</strong> {device.description || 'N/A'}
                  </p>
                  <p>
                    <strong>WiFi:</strong> {device.wifiSSID || 'N/A'}
                  </p>
                  <p>
                    <strong>Data Interval:</strong> {`${device.dataInterval / 1000}s`}
                  </p>
                </div>

                <div className="device-actions">
                  <button
                    className="edit"
                    onClick={() => handleEdit(device)}
                  >
                    <Edit2 size={16} />
                    Configure WiFi & Interval
                  </button>
                  {/* Devices are auto-created from Adafruit, deletion not recommended */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No devices found</h3>
            <p>Devices are automatically created when data is received from Adafruit IO</p>
          </div>
        )}
      </div>
    </div>
  );
}
