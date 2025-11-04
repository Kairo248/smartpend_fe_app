'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import BudgetCard from '@/components/budgets/BudgetCard';
import BudgetStats from '@/components/budgets/BudgetStats';
import { api } from '@/lib/api';
import { Plus, Target, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface Budget {
  id: number;
  name: string;
  amount: number;
  spentAmount: number;
  remainingAmount: number;
  spentPercentage: number;
  category: {
    id: number;
    name: string;
    color: string;
    icon: string;
  } | null;
  period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
  startDate: string;
  endDate: string;
  isActive: boolean;
  alertThreshold: number;
  alertEnabled: boolean;
  description: string;
  isOverBudget: boolean;
  shouldAlert: boolean;
  isExpired: boolean;
  daysRemaining: number;
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
  budgets: Budget[];
  overBudgets: Budget[];
  alertingBudgetsList: Budget[];
}

export default function BudgetsPage() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'over' | 'alerting'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'spent' | 'remaining'>('name');

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const [budgetsResponse, summaryResponse] = await Promise.all([
        api.get('/budgets'),
        api.get('/budgets/summary'),
      ]);
      
      setBudgets(budgetsResponse.data);
      setBudgetSummary(summaryResponse.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching budgets:', err);
      setError(err.response?.data?.message || 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (budgetId: number) => {
    if (!confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      await api.delete(`/budgets/${budgetId}`);
      await fetchBudgets();
    } catch (err: any) {
      console.error('Error deleting budget:', err);
      alert(err.response?.data?.message || 'Failed to delete budget');
    }
  };

  const getFilteredBudgets = () => {
    if (!budgetSummary) return [];
    
    let filteredBudgets = budgets;
    
    switch (filter) {
      case 'active':
        filteredBudgets = budgets.filter(b => b.isActive && !b.isExpired);
        break;
      case 'over':
        filteredBudgets = budgetSummary.overBudgets;
        break;
      case 'alerting':
        filteredBudgets = budgetSummary.alertingBudgetsList;
        break;
      default:
        filteredBudgets = budgets;
    }

    // Sort budgets
    return [...filteredBudgets].sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'spent':
          return b.spentAmount - a.spentAmount;
        case 'remaining':
          return b.remainingAmount - a.remainingAmount;
        default:
          return a.name.localeCompare(b.name);
      }
    });
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
              <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Budgets</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchBudgets}
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

  const filteredBudgets = getFilteredBudgets();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
              <p className="text-gray-600">Track and manage your spending limits</p>
            </div>
            <Link
              href="/budgets/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Budget
            </Link>
          </div>

          {/* Budget Summary Stats */}
          {budgetSummary && (
            <BudgetStats budgetSummary={budgetSummary} />
          )}

          {/* Filters and Controls */}
          {/* Filters and Controls */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'over' | 'alerting')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Budgets</option>
                  <option value="active">Active</option>
                  <option value="over">Over Budget</option>
                  <option value="alerting">Alerting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'amount' | 'spent' | 'remaining')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="name">Name</option>
                  <option value="amount">Budget Amount</option>
                  <option value="spent">Spent Amount</option>
                  <option value="remaining">Remaining</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredBudgets.length} budget{filteredBudgets.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          {/* Budget Grid */}
          {filteredBudgets.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBudgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  onDelete={handleDeleteBudget}
                  onUpdate={fetchBudgets}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {filter === 'all' ? 'No budgets yet' : `No ${filter} budgets`}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? 'Get started by creating your first budget to track spending limits.'
                  : 'Try adjusting your filters or create a new budget.'
                }
              </p>
              {filter === 'all' && (
                <div className="mt-6">
                  <Link
                    href="/budgets/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Create Your First Budget
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}