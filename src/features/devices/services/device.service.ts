/**
 * Device service - handles device-related API calls
 */

import { apiClient } from '../../../lib/api-client';
import type { Device, ApiResponse } from '../../../types';

export const deviceService = {
  async getDevices(): Promise<Device[]> {
    const response = await apiClient.get<{ items: Device[] }>('/devices');
    // Backend returns { items: [...] }, but we want to return just the array
    const devices = Array.isArray(response) ? response : (response?.items || []);
    return devices;
  },

  async getDeviceById(id: string): Promise<Device> {
    return apiClient.get<Device>(`/devices/${id}`);
  },

  async createDevice(data: Partial<Device>): Promise<Device> {
    return apiClient.post<Device>('/devices', data);
  },

  async updateDevice(id: string, data: Partial<Device>): Promise<Device> {
    return apiClient.put<Device>(`/devices/${id}`, data);
  },

  async deleteDevice(id: string): Promise<null> {
    return apiClient.delete<null>(`/devices/${id}`);
  },

  async getDeviceStatus(id: string): Promise<{ status: string }> {
    return apiClient.get<{ status: string }>(`/devices/${id}/status`);
  },
};
