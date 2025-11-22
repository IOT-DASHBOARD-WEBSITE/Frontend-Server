'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SensorData } from '@/types';

interface LightChartProps {
  data: SensorData[];
}

export const LightChart: React.FC<LightChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-empty">No data available</div>;
  }

  const chartData = data
    .slice()
    .reverse()
    .map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString(),
      light: item.light,
    }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="time" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="light"
            stroke="#fbbf24"
            dot={false}
            strokeWidth={2}
            name="Light Intensity (lux)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

