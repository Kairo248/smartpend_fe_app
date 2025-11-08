'use client';

import { DollarSign, TrendingUp, TrendingDown, Wallet, AlertTriangle, Target } from 'lucide-react';
import { formatAmount, DEFAULT_CURRENCY } from '@/lib/currency';

interface DashboardSummaryProps {
  summary: {
    currentMonthExpenses: number;
    currentMonthIncome: number;
    currentMonthNet: number;
    currentMonthTransactions: number;
    previousMonthExpenses: number;
    expenseChange: number;
    expenseChangePercentage: number;
    budgetSummary: {
      totalBudgeted: number;
      totalSpent: number;
      totalRemaining: number;
      budgetUtilization: number;
      activeBudgets: number;
      overBudgets: number;
      alertingBudgets: number;
    };
  };
}

export default function DashboardSummary({ summary }: DashboardSummaryProps) {
  const formatCurrency = (amount: number) => {
    return formatAmount(amount, DEFAULT_CURRENCY);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Current Month Expenses */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="shrink-0">
              <DollarSign className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Monthly Expenses
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(summary.currentMonthExpenses)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm flex items-center">
            {summary.expenseChangePercentage >= 0 ? (
              <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
            )}
            <span className={`font-medium ${summary.expenseChangePercentage >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatPercentage(summary.expenseChangePercentage)}
            </span>
            <span className="text-gray-600 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Current Month Income */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="shrink-0">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Monthly Income
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(summary.currentMonthIncome)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="text-gray-600">
              Net: {' '}
              <span className={`font-medium ${summary.currentMonthNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.currentMonthNet)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="shrink-0">
              <Target className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Budget Used
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {summary.budgetSummary.budgetUtilization.toFixed(1)}%
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="text-gray-600">
              {formatCurrency(summary.budgetSummary.totalSpent)} of {formatCurrency(summary.budgetSummary.totalBudgeted)}
            </span>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="shrink-0">
              <AlertTriangle className={`h-6 w-6 ${summary.budgetSummary.overBudgets > 0 ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Budget Alerts
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {summary.budgetSummary.alertingBudgets}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            {summary.budgetSummary.overBudgets > 0 ? (
              <span className="text-red-600 font-medium">
                {summary.budgetSummary.overBudgets} over budget
              </span>
            ) : (
              <span className="text-green-600 font-medium">
                All budgets on track
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}