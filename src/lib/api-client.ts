/**
 * Utility functions for API calls
 */

import { API_BASE_URL, API_TIMEOUT } from '../constants';
import type { PaginatedResponse, FilterOptions } from '../types';

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      console.log(`🌐 API Request: ${url}`);
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning page
          ...options.headers,
        },
        signal: controller.signal,
      });
      
      console.log(`📡 API Response: ${response.status} ${response.statusText} for ${url}`);

      // Check content type before parsing
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      // For 204 No Content responses, return null
      if (response.status === 204) {
        return null as any;
      }

      // Read response as text first (can only read once)
      const responseText = await response.text();

      // Check if response is JSON
      if (!isJson) {
        console.error(`❌ Expected JSON but got ${contentType}. URL: ${url}`);
        console.error(`Response: ${responseText.substring(0, 200)}...`);
        throw new Error(`Expected JSON but got ${contentType}. Status: ${response.status}`);
      }

      // Check if response is OK
      if (!response.ok) {
        console.error(`❌ HTTP error! status: ${response.status}, URL: ${url}`);
        console.error(`Response: ${responseText.substring(0, 200)}...`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse JSON
      try {
        const json = JSON.parse(responseText);
        return json;
      } catch (parseError) {
        console.error(`❌ Failed to parse JSON. URL: ${url}`);
        console.error(`Response: ${responseText.substring(0, 200)}...`);
        throw new Error(`Invalid JSON response. Status: ${response.status}`);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // GET requests
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  async getWithFilters<T>(
    endpoint: string,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<T>> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.order) params.append('order', filters.order);

    const url = params.toString() ? `${endpoint}?${params}` : endpoint;
    return this.request<PaginatedResponse<T>>(url, {
      method: 'GET',
    });
  }

  // POST requests
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT requests
  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE requests
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
