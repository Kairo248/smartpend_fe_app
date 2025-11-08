'use client';

import { TrendingUp, TrendingDown, Target, AlertTriangle, DollarSign, Calendar } from 'lucide-react';
import { formatAmount, DEFAULT_CURRENCY } from '@/lib/currency';

export interface BudgetStatsData {
  totalBudgets: number;
  totalBudgetAmount: number;
  totalSpent: number;
  totalRemaining: number;
  overBudgetCount: number;
  alertingCount: number;
  averageProgress: number;
  monthlyTrend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

interface BudgetSummary {
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  overallSpentPercentage: number;
  totalBudgets: number;
  activeBudgets: number;
  overBudgetCount: number;
  alertingBudgets: number;
}

interface BudgetStatsProps {
  stats?: BudgetStatsData;
  budgetSummary?: BudgetSummary;
  isLoading?: boolean;
}

export default function BudgetStats({ stats, budgetSummary, isLoading = false }: BudgetStatsProps) {
  const formatCurrency = (amount: number) => 
    formatAmount(amount, DEFAULT_CURRENCY);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  // Convert BudgetSummary to BudgetStatsData if needed
  const statsData: BudgetStatsData | null = stats || (budgetSummary ? {
    totalBudgets: budgetSummary.totalBudgets,
    totalBudgetAmount: budgetSummary.totalBudgeted,
    totalSpent: budgetSummary.totalSpent,
    totalRemaining: budgetSummary.totalRemaining,
    overBudgetCount: budgetSummary.overBudgetCount,
    alertingCount: budgetSummary.alertingBudgets,
    averageProgress: budgetSummary.overallSpentPercentage,
    monthlyTrend: budgetSummary.totalSpent > budgetSummary.totalBudgeted * 0.8 ? 'up' : 'down',
    trendPercentage: Math.abs(budgetSummary.overallSpentPercentage - 70) // Mock trend
  } : null);

  if (isLoading || !statsData) {
    return (
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-md h-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      title: 'Total Budget',
      value: formatCurrency(statsData.totalBudgetAmount),
      icon: DollarSign,
      color: 'blue',
      subtitle: `${statsData.totalBudgets} budget${statsData.totalBudgets !== 1 ? 's' : ''}`,
    },
    {
      title: 'Total Spent',
      value: formatCurrency(statsData.totalSpent),
      icon: TrendingUp,
      color: 'purple',
      subtitle: formatPercentage((statsData.totalSpent / statsData.totalBudgetAmount) * 100) + ' of budget',
    },
    {
      title: 'Remaining',
      value: formatCurrency(statsData.totalRemaining),
      icon: Target,
      color: 'green',
      subtitle: formatPercentage((statsData.totalRemaining / statsData.totalBudgetAmount) * 100) + ' available',
    },
    {
      title: 'Monthly Trend',
      value: formatPercentage(statsData.trendPercentage),
      icon: statsData.monthlyTrend === 'up' ? TrendingUp : TrendingDown,
      color: statsData.monthlyTrend === 'up' ? 'red' : 'green',
      subtitle: statsData.monthlyTrend === 'up' ? 'Increase' : 'Decrease',
    },
  ];

  const alertItems = [
    {
      title: 'Over Budget',
      value: statsData.overBudgetCount,
      color: 'red',
      subtitle: 'budgets exceeded',
    },
    {
      title: 'Need Attention',
      value: statsData.alertingCount,
      color: 'yellow',
      subtitle: 'budgets alerting',
    },
    {
      title: 'Avg Progress',
      value: formatPercentage(statsData.averageProgress),
      color: 'blue',
      subtitle: 'completion rate',
    },
    {
      title: 'Active Period',
      value: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      color: 'gray',
      subtitle: 'current month',
      icon: Calendar,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700',
      purple: 'bg-purple-50 text-purple-700',
      green: 'bg-green-50 text-green-700',
      red: 'bg-red-50 text-red-700',
      yellow: 'bg-yellow-50 text-yellow-700',
      gray: 'bg-gray-50 text-gray-700',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-500',
      purple: 'text-purple-500',
      green: 'text-green-500',
      red: 'text-red-500',
      yellow: 'text-yellow-500',
      gray: 'text-gray-500',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="bg-white shadow rounded-lg border border-gray-200">
      <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Budget Overview</h3>
            <div className="flex items-center space-x-2">
              {statsData.overBudgetCount > 0 && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>{statsData.overBudgetCount} over budget</span>
                </div>
              )}
            </div>
          </div>        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statItems.map((item, index) => (
            <div key={index} className={`p-4 rounded-lg ${getColorClasses(item.color)}`}>
              <div className="flex items-center">
                {item.icon && (
                  <item.icon className={`h-5 w-5 ${getIconColorClasses(item.color)} mr-2`} />
                )}
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide opacity-80">
                    {item.title}
                  </p>
                  <p className="text-lg font-semibold">{item.value}</p>
                  <p className="text-xs opacity-75">{item.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alert Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {alertItems.map((item, index) => (
            <div key={index} className={`p-3 rounded-lg border ${getColorClasses(item.color)}`}>
              <div className="flex items-center">
                {item.icon && (
                  <item.icon className={`h-4 w-4 ${getIconColorClasses(item.color)} mr-2`} />
                )}
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide opacity-80">
                    {item.title}
                  </p>
                  <p className="text-sm font-semibold">{item.value}</p>
                  <p className="text-xs opacity-75">{item.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Overall Budget Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {formatPercentage(statsData.averageProgress)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                statsData.averageProgress >= 100 
                  ? 'bg-red-500' 
                  : statsData.averageProgress >= 80 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(statsData.averageProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}