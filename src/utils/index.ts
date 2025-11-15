/**
 * Shared utility functions
 */

/**
 * Format temperature value with unit
 */
export function formatTemperature(temp: number | undefined): string {
  if (temp === undefined || temp === null) return 'N/A';
  return `${temp.toFixed(1)}°C`;
}

/**
 * Format humidity value with unit
 */
export function formatHumidity(humidity: number | undefined): string {
  if (humidity === undefined || humidity === null) return 'N/A';
  return `${humidity.toFixed(1)}%`;
}

/**
 * Format pressure value with unit
 */
export function formatPressure(pressure: number | undefined): string {
  if (pressure === undefined || pressure === null) return 'N/A';
  return `${pressure.toFixed(2)} hPa`;
}

/**
 * Format date to readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format time to readable format (HH:MM:SS)
 */
export function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Get device status color
 */
export function getDeviceStatusColor(status: string): string {
  const colors: Record<string, string> = {
    online: 'text-green-600 bg-green-100',
    offline: 'text-red-600 bg-red-100',
    error: 'text-yellow-600 bg-yellow-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
}

/**
 * Truncate string to max length
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

/**
 * Debounce function for throttling
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Format number to currency
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Check if value is within range
 */
export function isWithinRange(
  value: number,
  min: number,
  max: number
): boolean {
  return value >= min && value <= max;
}
