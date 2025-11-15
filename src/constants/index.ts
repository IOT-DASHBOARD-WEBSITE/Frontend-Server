/**
 * Application constants
 */

// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Feature flags
export const FEATURES = {
  REALTIME_UPDATES: true,
  DATA_EXPORT: true,
  ADVANCED_ANALYTICS: true,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Device status colors
export const DEVICE_STATUS_COLORS = {
  online: '#10b981',
  offline: '#ef4444',
  error: '#f59e0b',
};

// Sensor thresholds
export const SENSOR_THRESHOLDS = {
  temperature: {
    min: 0,
    max: 50,
    warning: 40,
  },
  humidity: {
    min: 0,
    max: 100,
    warning: 80,
  },
  pressure: {
    min: 900,
    max: 1100,
    warning: 1020,
  },
};

// Refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  SENSORS: 5000, // 5 seconds
  DEVICES: 10000, // 10 seconds
  STATS: 30000, // 30 seconds
};

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  DEVICES: '/devices',
  DEVICE_DETAIL: '/devices/:id',
  CONTROL: '/control',
  NOTIFICATIONS: '/notifications',
};

// Error messages
export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch data. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_INPUT: 'Invalid input. Please check your data.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully.',
  UPDATED: 'Resource updated successfully.',
  DELETED: 'Resource deleted successfully.',
  SAVED: 'Changes saved successfully.',
};
