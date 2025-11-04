'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import BudgetOverview from '@/components/dashboard/BudgetOverview';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import QuickActions from '@/components/dashboard/QuickActions';
import SpendingChart from '@/components/dashboard/SpendingChart';
import { api } from '@/lib/api';

interface DashboardData {
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
    quickStats: {
      averageDailySpending: number;
      largestExpense: number;
      topCategory: string;
      topCategoryAmount: number;
      daysUntilNextBudgetReset: number;
      mostUsedWallet: string;
    };
    recentTransactions: Array<{
      id: number;
      description: string;
      amount: number;
      type: 'EXPENSE' | 'INCOME';
      categoryName: string;
      categoryColor: string;
      walletName: string;
      date: string;
    }>;
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
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data from:', `${api.defaults.baseURL}/analytics/dashboard`);
      const response = await api.get('/analytics/dashboard');
      console.log('Dashboard data received:', response.data);
      setDashboardData({ summary: response.data });
      setError(null);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      console.error('Request URL:', err.config?.url);
      console.error('Response status:', err.response?.status);
      console.error('Response data:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Dashboard</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!dashboardData) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">No dashboard data available</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
            </div>
            <QuickActions onDataChange={fetchDashboardData} />
          </div>

          {/* Dashboard Summary Cards */}
          <DashboardSummary summary={dashboardData.summary} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts and Analytics */}
            <div className="lg:col-span-2 space-y-6">
              <SpendingChart />
              <BudgetOverview 
                budgetSummary={dashboardData.summary.budgetSummary}
                budgetAlerts={dashboardData.summary.budgetAlerts}
              />
            </div>

            {/* Right Column - Recent Activity */}
            <div className="space-y-6">
              <RecentTransactions 
                transactions={dashboardData.summary.recentTransactions}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}