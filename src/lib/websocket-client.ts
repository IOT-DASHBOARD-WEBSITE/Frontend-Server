/**
 * Socket.IO client for real-time updates
 */

import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../constants';

type MessageHandler = (data: unknown) => void;

class WebSocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private isConnecting = false;

  private getSocketUrl(): string {
    // Convert http://localhost:3001/api to http://localhost:3001
    return API_BASE_URL.replace('/api', '');
  }

  connect(): void {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    const url = this.getSocketUrl();

    try {
      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: this.reconnectDelay,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.socket.on('connect', () => {
        console.log('Socket.IO connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      });

      this.socket.on('connected', (message: unknown) => {
        console.log('Socket.IO server message:', message);
      });

      this.socket.on('device-status', (data: unknown) => {
        this.handleMessage('device-status', data);
      });

      this.socket.on('sensor-data', (data: unknown) => {
        this.handleMessage('sensor-data', data);
      });

      this.socket.on('subscribed', (data: unknown) => {
        console.log('Subscribed to device:', data);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
        this.isConnecting = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        this.isConnecting = false;
        this.reconnectAttempts++;
      });
    } catch (error) {
      console.error('Failed to create Socket.IO connection:', error);
      this.isConnecting = false;
    }
  }

  private handleMessage(eventType: string, message: unknown): void {
    const handlers = this.messageHandlers.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(message);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    }

    // Also trigger handlers for all messages
    const allHandlers = this.messageHandlers.get('*');
    if (allHandlers) {
      allHandlers.forEach((handler) => {
        try {
          handler({ type: eventType, ...(typeof message === 'object' && message !== null ? message : { data: message }) });
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    }
  }

  subscribe(eventType: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(eventType)) {
      this.messageHandlers.set(eventType, new Set());
    }

    this.messageHandlers.get(eventType)!.add(handler);

    // Auto-connect if not connected
    if (!this.socket || !this.socket.connected) {
      this.connect();
    }

    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.messageHandlers.delete(eventType);
        }
      }
    };
  }

  send(event: string, message: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, message);
    } else {
      console.warn('Socket.IO is not connected. Message not sent:', event, message);
    }
  }

  subscribeToDevice(deviceId: string): void {
    this.send('subscribe-device', { deviceId });
  }

  unsubscribeFromDevice(deviceId: string): void {
    this.send('unsubscribe-device', { deviceId });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.messageHandlers.clear();
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const websocketClient = new WebSocketClient();

