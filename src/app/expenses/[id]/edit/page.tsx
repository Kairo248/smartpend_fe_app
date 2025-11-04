'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import ExpenseForm, { ExpenseFormData } from '@/components/expenses/ExpenseForm';
import { api } from '@/lib/api';
import { Receipt, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ExpenseData {
  id: number;
  description: string;
  amount: number;
  currency: string;
  type: 'EXPENSE' | 'INCOME';
  transactionDate: string;
  merchant?: string;
  tagsJson?: string;
  attachmentsJson?: string;
  isRecurring: boolean;
  category: {
    id: number;
    name: string;
  };
  wallet: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function EditExpensePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const expenseId = params?.id as string;
  
  const [expense, setExpense] = useState<ExpenseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExpense, setIsLoadingExpense] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && expenseId) {
      fetchExpense();
    }
  }, [user, expenseId]);

  const fetchExpense = async () => {
    try {
      setIsLoadingExpense(true);
      const response = await api.get(`/expenses/${expenseId}`);
      setExpense(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching expense:', err);
      if (err.response?.status === 404) {
        setError('Expense not found');
      } else {
        setError(err.response?.data?.message || 'Failed to load expense');
      }
    } finally {
      setIsLoadingExpense(false);
    }
  };

  const handleSubmit = async (formData: ExpenseFormData) => {
    if (!user || !expenseId) return;

    try {
      setIsLoading(true);
      setError(null);

      const expenseData = {
        description: formData.description,
        amount: formData.amount,
        currency: expense?.currency || 'USD', // Use existing currency or default
        type: formData.type,
        categoryId: formData.categoryId,
        walletId: formData.walletId,
        transactionDate: formData.transactionDate,
        merchant: expense?.merchant || '',
        tagsJson: expense?.tagsJson || null,
        attachmentsJson: expense?.attachmentsJson || null,
        isRecurring: expense?.isRecurring || false,
      };

      console.log('Updating expense:', expenseData);
      
      const response = await api.put(`/expenses/${expenseId}`, expenseData);
      
      console.log('Expense updated successfully:', response.data);
      
      // Redirect to expenses page on success
      router.push('/expenses?updated=true');
      
    } catch (err: any) {
      console.error('Error updating expense:', err);
      setError(err.response?.data?.message || 'Failed to update expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/expenses');
  };

  if (isLoadingExpense) {
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

  if (error && !expense) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Expense</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link
                href="/expenses"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Expenses
              </Link>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!expense) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600">Expense not found</p>
              <Link
                href="/expenses"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Expenses
              </Link>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const initialData: Partial<ExpenseFormData> = {
    description: expense.description,
    amount: expense.amount,
    type: expense.type,
    categoryId: expense.category.id,
    walletId: expense.wallet.id,
    transactionDate: expense.transactionDate,
    notes: '', // Backend doesn't have notes field, using description
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
                  Edit Transaction
                </h1>
                <p className="text-gray-600">Update your transaction details</p>
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
                <span className="text-gray-500 font-medium">Edit Transaction</span>
              </li>
            </ol>
          </nav>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="shrink-0">
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
              <h2 className="text-lg font-medium text-gray-900">Update Transaction Details</h2>
              <p className="text-sm text-gray-500">Modify the information below to update your transaction</p>
            </div>
            
            <div className="px-6 py-6">
              <ExpenseForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isLoading}
                initialData={initialData}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}