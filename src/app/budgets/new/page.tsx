'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import BudgetForm from '@/components/budgets/BudgetForm';
import { api } from '@/lib/api';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

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

export default function NewBudgetPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: BudgetFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields before sending
      if (!formData.name || !formData.startDate || !formData.endDate) {
        setError('Please fill in all required fields');
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
        description: formData.description?.trim() || null
      };

      console.log('Creating budget with data:', JSON.stringify(budgetData, null, 2));
      
      const response = await api.post('/budgets', budgetData);

      // Show success message (you can implement toast notifications later)
      console.log('Budget created successfully:', response.data);
      
      // Redirect to budget list page
      router.push('/budgets');
    } catch (err: any) {
      console.error('Error creating budget:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        JSON.stringify(err.response?.data) || 
        'Failed to create budget. Please check your input and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/budgets');
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
                  <Plus className="h-8 w-8 mr-3 text-blue-600" />
                  Create New Budget
                </h1>
                <p className="text-gray-600 mt-1">
                  Set up a spending limit to track and control your expenses
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Creating Budget
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Budget Form */}
          <div className="bg-white shadow rounded-lg border border-gray-200">
            <div className="px-6 py-6">
              <BudgetForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isLoading}
                submitLabel="Create Budget"
              />
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-3">💡 Budget Tips</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                <span>Set realistic amounts based on your spending history</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                <span>Enable alerts to get notified before you overspend</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                <span>Review and adjust your budgets monthly for better results</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                <span>Use custom periods for special events or goals</span>
              </li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}