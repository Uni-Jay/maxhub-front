/**
 * Chart Components for Dashboards
 * Using Recharts for data visualization
 */

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

interface LineChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  title?: string;
  height?: number;
  color?: string;
}

export function SimpleLineChart({
  data,
  dataKey,
  title,
  height = 300,
  color = '#3b82f6',
}: LineChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis dataKey="name" stroke="currentColor" opacity={0.5} fontSize={12} />
          <YAxis stroke="currentColor" opacity={0.5} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface AreaChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  title?: string;
  height?: number;
  color?: string;
}

export function SimpleAreaChart({
  data,
  dataKey,
  title,
  height = 300,
  color = '#3b82f6',
}: AreaChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis dataKey="name" stroke="currentColor" opacity={0.5} fontSize={12} />
          <YAxis stroke="currentColor" opacity={0.5} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={color}
            fillOpacity={0.2}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface BarChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  title?: string;
  height?: number;
  color?: string;
}

export function SimpleBarChart({
  data,
  dataKey,
  title,
  height = 300,
  color = '#3b82f6',
}: BarChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis dataKey="name" stroke="currentColor" opacity={0.5} fontSize={12} />
          <YAxis stroke="currentColor" opacity={0.5} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Bar dataKey={dataKey} fill={color} isAnimationActive={true} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface MultiBarChartProps {
  data: ChartDataPoint[];
  dataKeys: string[];
  title?: string;
  height?: number;
  colors?: string[];
}

export function MultiBarChart({
  data,
  dataKeys,
  title,
  height = 300,
  colors = COLORS,
}: MultiBarChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis dataKey="name" stroke="currentColor" opacity={0.5} fontSize={12} />
          <YAxis stroke="currentColor" opacity={0.5} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend />
          {dataKeys.map((key, index) => (
            <Bar key={key} dataKey={key} fill={colors[index % colors.length]} isAnimationActive={true} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface SimplePieChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  title?: string;
  height?: number;
}

export function SimplePieChart({ data, dataKey, title, height = 300 }: SimplePieChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, value }) => `${name}: ${value}`}
            isAnimationActive={true}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * StatCard Component for displaying key metrics
 */
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
  green: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
  red: 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400',
  yellow: 'bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400',
  purple: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
};

export function StatCard({ label, value, icon, trend, color = 'blue' }: StatCardProps) {
  return (
    <div className={`rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {trend && (
            <p className={`text-xs font-semibold mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && <div className="text-3xl opacity-50">{icon}</div>}
      </div>
    </div>
  );
}

export default {
  SimpleLineChart,
  SimpleAreaChart,
  SimpleBarChart,
  MultiBarChart,
  SimplePieChart,
  StatCard,
};
