import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';

interface SalesMetric {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

export const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('monthly');

  // Mock data - TODO: Fetch from API
  const metrics: SalesMetric[] = [
    {
      label: 'Total Sales',
      value: 45230,
      change: 12.5,
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      label: 'Orders',
      value: 328,
      change: 8.2,
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      label: 'Avg Order Value',
      value: 1380,
      change: 5.1,
      icon: <PieChart className="w-6 h-6" />
    },
    {
      label: 'Conversion Rate',
      value: 3.2,
      change: -0.5,
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  const topProducts = [
    { name: 'Premium Headphones', sales: 245, revenue: 24500 },
    { name: 'Phone Case', sales: 512, revenue: 15360 },
    { name: 'Screen Protector', sales: 892, revenue: 5352 },
    { name: 'USB Cable', sales: 645, revenue: 2580 },
    { name: 'Power Bank', sales: 234, revenue: 7020 }
  ];

  const salesByCategory = [
    { category: 'Electronics', percentage: 45, amount: 20235 },
    { category: 'Accessories', percentage: 30, amount: 13569 },
    { category: 'Home & Garden', percentage: 15, amount: 6784 },
    { category: 'Fashion', percentage: 10, amount: 4512 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
          <p className="text-gray-600 mt-2">Track your sales performance and metrics</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="quarterly">This Quarter</option>
            <option value="yearly">This Year</option>
          </select>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm font-medium">{metric.label}</span>
                <div className="text-blue-600">{metric.icon}</div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {typeof metric.value === 'number' && metric.value > 100
                      ? `₹${metric.value.toLocaleString()}`
                      : `${metric.value}${metric.label.includes('%') ? '%' : ''}`}
                  </p>
                </div>
                <div className={`text-sm font-semibold ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Top Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product Name</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Sales</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition">
                      <td className="py-4 px-4 text-sm text-gray-900">{product.name}</td>
                      <td className="text-right py-4 px-4 text-sm text-gray-600">{product.sales.toLocaleString()}</td>
                      <td className="text-right py-4 px-4 text-sm font-semibold text-gray-900">
                        ₹{product.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sales by Category */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Sales by Category</h2>
            <div className="space-y-4">
              {salesByCategory.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">₹{item.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((order) => (
              <div key={order} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                <div>
                  <p className="font-semibold text-gray-900">Order #{1000 + order}</p>
                  <p className="text-sm text-gray-600">2 items • 2 hours ago</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{(1500 + order * 100).toLocaleString()}</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
