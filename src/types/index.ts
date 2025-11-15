/**
 * Shared type definitions for the application
 */

// Device types
export interface Device {
  id: string;
  deviceId: string;
  name: string;
  description?: string;
  wifiSSID?: string;
  wifiPassword?: string;
  dataInterval: number;
  lastSeen: string;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
}

// Sensor data types
export interface SensorData {
  id: string;
  deviceId: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  light?: number;
  timestamp: string;
  createdAt: string;
}

export interface SensorStatistics {
  deviceId: string;
  avgTemperature?: number;
  maxTemperature?: number;
  minTemperature?: number;
  avgHumidity?: number;
  maxHumidity?: number;
  minHumidity?: number;
  dataPoints: number;
  timeRange: {
    start: string;
    end: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Control command types
export interface ControlCommand {
  type: 'wifi' | 'device-id' | 'interval' | 'reboot';
  payload: Record<string, unknown>;
}

export interface WifiConfig {
  ssid: string;
  password: string;
}

export interface DeviceConfig {
  deviceId: string;
}

export interface IntervalConfig {
  interval: number; // in seconds
}

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp?: string;
}

// UI state types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface FilterOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
