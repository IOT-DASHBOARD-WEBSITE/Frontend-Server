'use client';

import { useState, useEffect } from 'react';
import { useDeviceContext } from '@/shared/contexts/DeviceContext';
import { deviceService } from '@/features/devices/services';
import { Edit2, X, Check } from 'lucide-react';
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
        // Update device
        await deviceService.updateDevice(editingId, {
          name: formData.name,
          description: formData.description,
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

        {/* Controls */}
        <div className="devices-controls">
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            {showForm ? 'Cancel' : '+ Add Device'}
          </button>
        </div>

        {/* Device Form */}
        {showForm && (
          <div className={`device-form show`}>
            <form onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: '24px', color: '#1f2937' }}>
                {editingId ? 'Edit Device' : 'Add New Device'}
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Device ID {!editingId && '*'}</label>
                  <input
                    type="text"
                    name="deviceId"
                    value={formData.deviceId}
                    onChange={handleInputChange}
                    placeholder="e.g., esp32-001"
                    disabled={!!editingId}
                    required={!editingId}
                  />
                </div>

                <div className="form-group">
                  <label>Device Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Kitchen Sensor"
                    required
                  />
                </div>

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
                    placeholder="e.g., 5"
                    min="1"
                    step="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Device description..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit" disabled={loading}>
                  {loading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update' : 'Add Device')}
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
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => device.id && handleDelete(device.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No devices registered yet</h3>
            <p>Click &quot;Add Device&quot; to register your first IoT device</p>
            <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
              Add Your First Device
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
