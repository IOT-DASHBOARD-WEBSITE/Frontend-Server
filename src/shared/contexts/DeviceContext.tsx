'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { deviceService } from '@/features/devices/services';
import type { Device } from '@/types';

interface DeviceContextType {
  devices: Device[];
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  refetchDevices: () => Promise<void>;
  loading: boolean;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const refetchDevices = useCallback(async () => {
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
    refetchDevices();
  }, [refetchDevices]);

  return (
    <DeviceContext.Provider
      value={{
        devices,
        selectedDeviceId,
        setSelectedDeviceId,
        refetchDevices,
        loading,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDeviceContext = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDeviceContext must be used within DeviceProvider');
  }
  return context;
};
