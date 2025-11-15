import { useState, useCallback, useEffect } from 'react';
import { deviceService } from '@/features/devices/services';
import type { Device } from '@/types';

interface UseDeviceStateReturn {
  devices: Device[];
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const useDeviceState = (): UseDeviceStateReturn => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await deviceService.getDevices();
      setDevices(data || []);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    loading,
    refetch: fetchDevices,
  };
};
