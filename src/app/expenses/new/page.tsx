'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import ExpenseForm, { ExpenseFormData } from '@/components/expenses/ExpenseForm';
import { api } from '@/lib/api';
import { Receipt, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewExpensePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get initial type from URL params
  const getInitialType = (): 'EXPENSE' | 'INCOME' => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('type') === 'income' ? 'INCOME' : 'EXPENSE';
    }
    return 'EXPENSE';
  };

  const handleSubmit = async (formData: ExpenseFormData) => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Prepare the expense data according to your backend API
      // Validate required fields before sending
      if (!formData.categoryId || !formData.walletId) {
        setError('Please select both a category and a wallet');
        return;
      }

      const expenseData = {
        walletId: Number(formData.walletId),
        categoryId: Number(formData.categoryId),
        amount: Number(formData.amount),
        currency: 'USD', // Default currency - TODO: get from user preferences or wallet
        transactionDate: formData.transactionDate,
        merchant: '',
        description: formData.description.trim(),
        tagsJson: null,
        attachmentsJson: null,
        type: formData.type,
        isRecurring: false,
      };

      console.log('Creating expense with data:', JSON.stringify(expenseData, null, 2));
      console.log('Form data original:', JSON.stringify(formData, null, 2));
      
      const response = await api.post('/expenses', expenseData);
      
      console.log('Expense created successfully:', response.data);
      
      // Redirect to expenses page on success
      router.push('/expenses?created=true');
      
    } catch (err: any) {
      console.error('Error creating expense:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || err.response?.data || 'Failed to create expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/expenses');
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/expenses"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Receipt className="h-8 w-8 mr-3 text-blue-600" />
                  Add New Transaction
                </h1>
                <p className="text-gray-600">Record a new income or expense transaction</p>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/expenses" className="text-gray-400 hover:text-gray-500">
                  Expenses
                </Link>
              </li>
              <li className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-500 font-medium">New Transaction</span>
              </li>
            </ol>
          </nav>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Transaction Details</h2>
              <p className="text-sm text-gray-500">Fill in the information below to record your transaction</p>
            </div>
            
            <div className="px-6 py-6">
              <ExpenseForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isLoading}
                initialData={{ type: getInitialType() }}
              />
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">💡 Tips for Recording Transactions</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use descriptive names to easily identify transactions later</li>
              <li>• Choose the correct category to improve your spending insights</li>
              <li>• Select the wallet where the transaction actually occurred</li>
              <li>• Set the correct date for accurate reporting</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}