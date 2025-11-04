'use client';

import { AlertTriangle, Target, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';

interface BudgetOverviewProps {
  budgetSummary: {
    totalBudgeted: number;
    totalSpent: number;
    totalRemaining: number;
    budgetUtilization: number;
    activeBudgets: number;
    overBudgets: number;
    alertingBudgets: number;
  };
  budgetAlerts: Array<{
    budgetId: number;
    budgetName: string;
    categoryName: string;
    spentPercentage: number;
    remainingAmount: number;
    alertType: string;
    message: string;
    alertDate: string;
  }>;
}

export default function BudgetOverview({ budgetSummary, budgetAlerts }: BudgetOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getAlertColor = (alertType: string, spentPercentage: number) => {
    if (alertType === 'OVERBUDGET') return 'text-red-600 bg-red-50';
    if (spentPercentage >= 90) return 'text-red-600 bg-red-50';
    if (spentPercentage >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getBudgetProgressColor = (percentage: number) => {
    if (percentage > 100) return 'bg-red-500';
    if (percentage >= 90) return 'bg-red-400';
    if (percentage >= 80) return 'bg-yellow-400';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Budget Overview
          </h3>
          <Link
            href="/budgets"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Manage Budgets
          </Link>
        </div>

        {/* Budget Summary Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {formatCurrency(budgetSummary.totalBudgeted)}
            </div>
            <div className="text-sm text-gray-500">Total Budgeted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {formatCurrency(budgetSummary.totalSpent)}
            </div>
            <div className="text-sm text-gray-500">Total Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">
              {formatCurrency(budgetSummary.totalRemaining)}
            </div>
            <div className="text-sm text-gray-500">Remaining</div>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Overall Budget Usage
            </span>
            <span className="text-sm text-gray-500">
              {budgetSummary.budgetUtilization.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getBudgetProgressColor(budgetSummary.budgetUtilization)}`}
              style={{ width: `${Math.min(budgetSummary.budgetUtilization, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Budget Alerts */}
        {budgetAlerts && budgetAlerts.length > 0 ? (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
              Budget Alerts ({budgetAlerts.length})
            </h4>
            <div className="space-y-3">
              {budgetAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.budgetId}
                  className={`p-3 rounded-lg border ${getAlertColor(alert.alertType, alert.spentPercentage)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {alert.budgetName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {alert.categoryName} • {alert.spentPercentage.toFixed(1)}% used
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(alert.remainingAmount)}
                      </p>
                      <p className="text-xs text-gray-600">remaining</p>
                    </div>
                  </div>
                </div>
              ))}
              {budgetAlerts.length > 3 && (
                <div className="text-center">
                  <Link
                    href="/budgets"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View all {budgetAlerts.length} alerts →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              All budgets on track
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Great job managing your spending! All your budgets are within limits.
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {budgetSummary.activeBudgets}
              </div>
              <div className="text-xs text-gray-500">Active Budgets</div>
            </div>
            <div>
              <div className={`text-lg font-semibold ${budgetSummary.overBudgets > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {budgetSummary.overBudgets}
              </div>
              <div className="text-xs text-gray-500">Over Budget</div>
            </div>
            <div>
              <div className={`text-lg font-semibold ${budgetSummary.alertingBudgets > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
                {budgetSummary.alertingBudgets}
              </div>
              <div className="text-xs text-gray-500">Need Attention</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}