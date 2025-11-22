'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import type { Device } from '@/types';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  unit?: string;
  color?: 'blue' | 'orange' | 'green' | 'red' | 'yellow';
  trend?: 'up' | 'down' | 'stable';
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  unit = '',
  color = 'blue',
  trend,
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-header">
        <Icon className="stat-icon" size={28} />
        <h3 className="stat-title">{title}</h3>
      </div>
      <div className="stat-value">
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
      {TrendIcon && <TrendIcon className={`stat-trend trend-${trend}`} size={16} />}
    </div>
  );
};

interface DeviceCardProps {
  device: Device;
  isSelected: boolean;
  onClick: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, isSelected, onClick }) => {
  const statusColor = device.isOnline ? '#4caf50' : '#f44336';
  const statusText = device.isOnline ? 'Online' : 'Offline';

  return (
    <div className={`device-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className="device-header">
        <div className="device-name">{device.name || device.deviceId}</div>
        <div className="device-status" style={{ backgroundColor: statusColor }}>
          {statusText}
        </div>
      </div>
      <div className="device-info">
        <small>{device.description || device.deviceId}</small>
      </div>
    </div>
  );
};
