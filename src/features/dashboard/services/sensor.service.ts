import { apiClient } from '../../../lib/api-client';
import type { SensorData, SensorStatistics } from '../../../types';

export const sensorService = {
  async getSensorData(deviceId?: string, limit = 20): Promise<SensorData[]> {
    let endpoint = '/sensors';
    if (deviceId) {
      endpoint += `?deviceId=${deviceId}&limit=${limit}`;
    }
    const response = await apiClient.get<{ items: SensorData[] } | SensorData[]>(endpoint);
    return Array.isArray(response) ? response : (response?.items || []);
  },

  async getLatestSensorData(deviceId: string): Promise<SensorData | null> {
    const response = await apiClient.get<SensorData[]>(`/sensors/latest/${deviceId}`);
    return response && response.length > 0 ? response[0] : null;
  },

  async getSensorStatistics(deviceId: string): Promise<SensorStatistics> {
    const response = await apiClient.get<{ statistics?: SensorStatistics } | SensorStatistics>(`/sensors/statistics/${deviceId}`);
    return typeof response === 'object' && 'statistics' in response && response.statistics ? response.statistics : response as SensorStatistics;
  },

  async createSensorData(data: Partial<SensorData>): Promise<SensorData> {
    return apiClient.post<SensorData>('/sensors', data);
  },
};
