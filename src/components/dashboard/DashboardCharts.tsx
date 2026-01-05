/**
 * Dashboard Charts Component - Interactive charts for WMS analytics
 * Uses recharts for data visualization with real-time updates
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// CHART COLOR PALETTES
// ============================================================================

const COLORS = {
  primary: '#3b82f6',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899',
};

const STATUS_COLORS = {
  active: COLORS.success,
  inactive: COLORS.secondary,
  pending: COLORS.warning,
  completed: COLORS.primary,
  cancelled: COLORS.danger,
};

// ============================================================================
// SAMPLE DATA - Replace with real data from hooks
// ============================================================================

const getSampleStockData = () => [
  { month: 'Jan', incoming: 1200, outgoing: 980, adjustments: 45 },
  { month: 'Feb', incoming: 1350, outgoing: 1100, adjustments: 52 },
  { month: 'Mar', incoming: 1180, outgoing: 1250, adjustments: 38 },
  { month: 'Apr', incoming: 1420, outgoing: 1380, adjustments: 61 },
  { month: 'May', incoming: 1380, outgoing: 1420, adjustments: 49 },
  { month: 'Jun', incoming: 1520, outgoing: 1480, adjustments: 55 },
];

const getSampleOrderStatusData = () => [
  { name: 'Completed', value: 245, color: STATUS_COLORS.completed },
  { name: 'Processing', value: 89, color: STATUS_COLORS.active },
  { name: 'Pending', value: 34, color: STATUS_COLORS.pending },
  { name: 'Cancelled', value: 12, color: STATUS_COLORS.cancelled },
];

const getSampleWarehouseUtilization = () => [
  { warehouse: 'Main WH', utilization: 78, capacity: 85 },
  { warehouse: 'Branch A', utilization: 65, capacity: 70 },
  { warehouse: 'Branch B', utilization: 82, capacity: 80 },
  { warehouse: 'Production', utilization: 91, capacity: 90 },
];

const getSamplePerformanceData = () => [
  { week: 'W1', orders: 145, accuracy: 98.5, time: 2.3 },
  { week: 'W2', orders: 162, accuracy: 97.8, time: 2.1 },
  { week: 'W3', orders: 158, accuracy: 99.1, time: 2.4 },
  { week: 'W4', orders: 174, accuracy: 98.7, time: 2.2 },
];

// ============================================================================
// CHART COMPONENTS
// ============================================================================

/**
 * Stock Movement Chart - Bar chart showing incoming, outgoing, and adjustments
 */
export const StockMovementChart: React.FC = () => {
  const data = getSampleStockData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Movement Trends</CardTitle>
        <CardDescription>Monthly stock movements and adjustments</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="incoming" fill={COLORS.success} name="Incoming" />
            <Bar dataKey="outgoing" fill={COLORS.primary} name="Outgoing" />
            <Bar dataKey="adjustments" fill={COLORS.warning} name="Adjustments" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

/**
 * Order Status Distribution - Pie chart showing order statuses
 */
export const OrderStatusChart: React.FC = () => {
  const data = getSampleOrderStatusData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status Distribution</CardTitle>
        <CardDescription>Current order status breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

/**
 * Warehouse Utilization Chart - Horizontal bar chart
 */
export const WarehouseUtilizationChart: React.FC = () => {
  const data = getSampleWarehouseUtilization();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse Utilization</CardTitle>
        <CardDescription>Current vs maximum capacity utilization</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="warehouse" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="utilization" fill={COLORS.primary} name="Current %" />
            <Bar dataKey="capacity" fill={COLORS.secondary} name="Max Capacity %" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

/**
 * Performance Trends Chart - Line chart with multiple metrics
 */
export const PerformanceTrendsChart: React.FC = () => {
  const data = getSamplePerformanceData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
        <CardDescription>Weekly performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="orders" fill={COLORS.primary} name="Orders" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="accuracy"
              stroke={COLORS.success}
              strokeWidth={2}
              name="Accuracy %"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

/**
 * Revenue Trends Chart - Area chart for financial metrics
 */
export const RevenueTrendsChart: React.FC = () => {
  const data = getSampleStockData().map(item => ({
    month: item.month,
    revenue: (item.outgoing * 25), // Sample revenue calculation
    cost: (item.incoming * 20), // Sample cost calculation
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs Cost Trends</CardTitle>
        <CardDescription>Monthly financial performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, '']} />
            <Area
              type="monotone"
              dataKey="revenue"
              stackId="1"
              stroke={COLORS.success}
              fill={COLORS.success}
              fillOpacity={0.6}
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="cost"
              stackId="2"
              stroke={COLORS.danger}
              fill={COLORS.danger}
              fillOpacity={0.6}
              name="Cost"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// DASHBOARD LAYOUT COMPONENT
// ============================================================================

/**
 * Complete dashboard with all charts arranged in a responsive grid
 */
export const DashboardCharts: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockMovementChart />
        <OrderStatusChart />
      </div>

      {/* Middle Row - Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WarehouseUtilizationChart />
        <PerformanceTrendsChart />
      </div>

      {/* Bottom Row - Financial */}
      <div className="grid grid-cols-1 gap-6">
        <RevenueTrendsChart />
      </div>

      {/* Status Indicators */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="text-green-600">
          System Online
        </Badge>
        <Badge variant="outline" className="text-blue-600">
          Last Updated: {new Date().toLocaleTimeString()}
        </Badge>
        <Badge variant="outline" className="text-amber-600">
          3 Pending Approvals
        </Badge>
      </div>
    </div>
  );
};
