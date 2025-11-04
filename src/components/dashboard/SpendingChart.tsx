'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, BarChart } from 'lucide-react';
import { api } from '@/lib/api';

interface SpendingData {
  date: string;
  expenses: number;
  income: number;
  net: number;
}

export default function SpendingChart() {
  const [chartData, setChartData] = useState<SpendingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | '3months'>('month');

  useEffect(() => {
    fetchChartData();
  }, [selectedPeriod]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      
      const endDate = new Date();
      let startDate = new Date();
      
      switch (selectedPeriod) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
      }

      const response = await api.get('/analytics/expenses', {
        params: {
          startDate: startDate.toISOString().slice(0, 19), // Remove timezone, keep YYYY-MM-DDTHH:mm:ss
          endDate: endDate.toISOString().slice(0, 19),
        },
      });

      // Transform data for chart
      const dailyTrends = response.data.dailyTrends || [];
      setChartData(dailyTrends.map((trend: any) => ({
        date: trend.date,
        expenses: trend.totalExpenses,
        income: trend.totalIncome,
        net: trend.netAmount,
      })));
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Use mock data on error
      setChartData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): SpendingData[] => {
    const data: SpendingData[] = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        expenses: Math.random() * 200 + 50,
        income: Math.random() * 300 + 100,
        net: Math.random() * 100 - 50,
      });
    }
    
    return data;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.expenses, d.income))
  );

  const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);
  const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
  const netAmount = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Spending Trends
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Income vs Expenses over time
            </p>
          </div>
          
          {/* Period Selector */}
          <div className="flex rounded-md shadow-sm">
            {[
              { key: 'week', label: '7D' },
              { key: 'month', label: '30D' },
              { key: '3months', label: '3M' },
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-3 py-2 text-sm font-medium border ${
                  selectedPeriod === period.key
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${period.key === 'week' ? 'rounded-l-md' : ''} ${
                  period.key === '3months' ? 'rounded-r-md' : ''
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-lg font-semibold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <div className="text-sm text-gray-600">Total Expenses</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <div className="text-sm text-gray-600">Total Income</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className={`text-lg font-semibold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netAmount)}
            </div>
            <div className="text-sm text-gray-600">Net Amount</div>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="h-64 relative">
          {chartData.length > 0 ? (
            <div className="flex items-end space-x-1 h-full">
              {chartData.slice(-20).map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="flex-1 flex flex-col justify-end mb-2 space-y-1">
                    {/* Income Bar */}
                    <div
                      className="w-full bg-green-400 rounded-t"
                      style={{
                        height: `${(data.income / maxValue) * 200}px`,
                        minHeight: data.income > 0 ? '2px' : '0px',
                      }}
                      title={`Income: ${formatCurrency(data.income)}`}
                    ></div>
                    {/* Expenses Bar */}
                    <div
                      className="w-full bg-red-400 rounded-t"
                      style={{
                        height: `${(data.expenses / maxValue) * 200}px`,
                        minHeight: data.expenses > 0 ? '2px' : '0px',
                      }}
                      title={`Expenses: ${formatCurrency(data.expenses)}`}
                    ></div>
                  </div>
                  
                  {/* Date Label */}
                  {index % Math.ceil(chartData.slice(-20).length / 5) === 0 && (
                    <div className="text-xs text-gray-500 transform rotate-45 origin-left mt-2">
                      {formatDate(data.date)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BarChart className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  No spending data available
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Income</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      </div>
    </div>
  );
}