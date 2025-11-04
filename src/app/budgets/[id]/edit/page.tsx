'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import BudgetForm from '@/components/budgets/BudgetForm';
import { api } from '@/lib/api';
import { ArrowLeft, Edit, AlertTriangle } from 'lucide-react';
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
}

interface BudgetFormData {
  name: string;
  amount: number;
  categoryId: number;
  period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
  startDate: string;
  endDate: string;
  alertThreshold: number;
  alertEnabled: boolean;
  description: string;
}

export default function EditBudgetPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const budgetId = params?.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    if (budgetId && user) {
      fetchBudget();
    }
  }, [budgetId, user]);

  const fetchBudget = async () => {
    if (!budgetId) return;

    try {
      setLoading(true);
      const response = await api.get(`/budgets/${budgetId}`);
      setBudget(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching budget:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Failed to load budget details'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: BudgetFormData) => {
    if (!budgetId) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate required fields before sending
      if (!formData.name || !formData.startDate || !formData.endDate) {
        setSubmitError('Please fill in all required fields');
        return;
      }

      const budgetData = {
        name: formData.name.trim(),
        amount: Number(formData.amount),
        categoryId: formData.categoryId === 0 ? null : Number(formData.categoryId),
        period: formData.period,
        startDate: `${formData.startDate}T00:00:00`, // Convert to LocalDateTime format
        endDate: `${formData.endDate}T23:59:59`, // Convert to LocalDateTime format
        alertThreshold: Number(formData.alertThreshold),
        alertEnabled: formData.alertEnabled,
        description: formData.description?.trim() || null,
        isActive: true
      };

      console.log('Updating budget with data:', JSON.stringify(budgetData, null, 2));
      
      const response = await api.put(`/budgets/${budgetId}`, budgetData);

      // Show success message (you can implement toast notifications later)
      console.log('Budget updated successfully:', response.data);
      
      // Redirect to budget list page
      router.push('/budgets');
    } catch (err: any) {
      console.error('Error updating budget:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setSubmitError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        JSON.stringify(err.response?.data) || 
        'Failed to update budget'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/budgets');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center min-h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading budget details...</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error || !budget) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center min-h-64">
              <div className="text-center">
                <div className="text-red-600 text-xl mb-4">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                  Error Loading Budget
                </div>
                <p className="text-gray-600 mb-4">
                  {error || 'Budget not found'}
                </p>
                <div className="space-x-3">
                  <button
                    onClick={fetchBudget}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                  <Link
                    href="/budgets"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Back to Budgets
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const initialFormData: Partial<BudgetFormData> = {
    name: budget.name,
    amount: budget.amount,
    categoryId: budget.category?.id || 0,
    period: budget.period,
    startDate: budget.startDate,
    endDate: budget.endDate,
    alertThreshold: budget.alertThreshold,
    alertEnabled: budget.alertEnabled,
    description: budget.description || ''
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/budgets"
                className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Budgets
              </Link>
              <div className="h-6 border-l border-gray-300" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Edit className="h-8 w-8 mr-3 text-blue-600" />
                  Edit Budget
                </h1>
                <p className="text-gray-600 mt-1">
                  Update "{budget.name}" budget settings
                </p>
              </div>
            </div>
          </div>

          {/* Budget Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">Current Budget Status</h3>
                <p className="text-blue-700 mt-1">
                  ${budget.spentAmount.toFixed(2)} spent of ${budget.amount.toFixed(2)} 
                  ({budget.spentPercentage.toFixed(1)}% used)
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-600 font-medium">
                  {budget.category?.name}
                </div>
                <div className="text-xs text-blue-500">
                  {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    budget.spentPercentage >= 100 
                      ? 'bg-red-500' 
                      : budget.spentPercentage >= 80 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budget.spentPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Submit Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Updating Budget
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {submitError}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Budget Form */}
          <div className="bg-white shadow rounded-lg border border-gray-200">
            <div className="px-6 py-6">
              <BudgetForm
                initialData={initialFormData}
                budgetId={budgetId || undefined}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isSubmitting}
                submitLabel="Update Budget"
              />
            </div>
          </div>

          {/* Warning Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important Notes
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Changing the budget amount will not affect already recorded expenses</li>
                    <li>Modifying dates may impact budget calculations and alerts</li>
                    <li>Category changes will reclassify this budget but keep expense history</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}