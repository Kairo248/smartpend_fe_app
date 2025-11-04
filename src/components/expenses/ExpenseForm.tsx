'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Calendar, DollarSign, FileText, Tag, Wallet } from 'lucide-react';
import { formatAmount, getCurrencySymbol, DEFAULT_CURRENCY } from '@/lib/currency';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ExpenseFormData>;
  isLoading?: boolean;
}

export interface ExpenseFormData {
  description: string;
  amount: number;
  type: 'EXPENSE' | 'INCOME';
  categoryId: number;
  walletId: number;
  transactionDate: string;
  notes?: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

interface WalletData {
  id: number;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

export default function ExpenseForm({ onSubmit, onCancel, initialData, isLoading = false }: ExpenseFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: initialData?.description || '',
    amount: initialData?.amount || 0.01,
    type: initialData?.type || 'EXPENSE',
    categoryId: initialData?.categoryId || 0,
    walletId: initialData?.walletId || 0,
    transactionDate: initialData?.transactionDate || new Date().toISOString().split('T')[0],
    notes: initialData?.notes || '',
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      loadFormData();
    }
  }, [user]);

  const loadFormData = async () => {
    try {
      setLoadingData(true);
      const [categoriesResponse, walletsResponse] = await Promise.all([
        api.get('/categories'),
        api.get('/wallets'),
      ]);
      
      setCategories(categoriesResponse.data);
      setWallets(walletsResponse.data);
      
      // Set default category and wallet if not already set
      if ((!initialData?.categoryId || initialData.categoryId === 0) && categoriesResponse.data.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: categoriesResponse.data[0].id }));
      }
      if ((!initialData?.walletId || initialData.walletId === 0) && walletsResponse.data.length > 0) {
        setFormData(prev => ({ ...prev, walletId: walletsResponse.data[0].id }));
      }
    } catch (err) {
      console.error('Error loading form data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.walletId) {
      newErrors.walletId = 'Please select a wallet';
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = 'Transaction date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const updateFormData = (field: keyof ExpenseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaction Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateFormData('type', 'EXPENSE')}
            className={`p-3 border rounded-lg text-center ${
              formData.type === 'EXPENSE'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            💸 Expense
          </button>
          <button
            type="button"
            onClick={() => updateFormData('type', 'INCOME')}
            className={`p-3 border rounded-lg text-center ${
              formData.type === 'INCOME'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            💰 Income
          </button>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="inline h-4 w-4 mr-1" />
          Description
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter transaction description..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="inline h-4 w-4 mr-1" />
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {formData.walletId && wallets.length > 0 
              ? getCurrencySymbol(wallets.find(w => w.id === formData.walletId)?.currency || DEFAULT_CURRENCY)
              : getCurrencySymbol(DEFAULT_CURRENCY)
            }
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.amount || ''}
            onChange={(e) => updateFormData('amount', parseFloat(e.target.value) || 0)}
            className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Tag className="inline h-4 w-4 mr-1" />
          Category
        </label>
        <select
          value={formData.categoryId || ''}
          onChange={(e) => updateFormData('categoryId', parseInt(e.target.value))}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.categoryId ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a category...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
        )}
        {categories.length === 0 && (
          <p className="mt-1 text-sm text-gray-500">
            No categories available. Create one first.
          </p>
        )}
      </div>

      {/* Wallet */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Wallet className="inline h-4 w-4 mr-1" />
          Wallet
        </label>
        <select
          value={formData.walletId || ''}
          onChange={(e) => updateFormData('walletId', parseInt(e.target.value))}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.walletId ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a wallet...</option>
          {wallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.name} - {formatAmount(wallet.balance, wallet.currency)}
            </option>
          ))}
        </select>
        {errors.walletId && (
          <p className="mt-1 text-sm text-red-600">{errors.walletId}</p>
        )}
        {wallets.length === 0 && (
          <p className="mt-1 text-sm text-gray-500">
            No wallets available. Create one first.
          </p>
        )}
      </div>

      {/* Transaction Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="inline h-4 w-4 mr-1" />
          Transaction Date
        </label>
        <input
          type="date"
          value={formData.transactionDate}
          onChange={(e) => updateFormData('transactionDate', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.transactionDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.transactionDate && (
          <p className="mt-1 text-sm text-red-600">{errors.transactionDate}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add any additional notes..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || categories.length === 0 || wallets.length === 0}
          className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
            isLoading || categories.length === 0 || wallets.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : formData.type === 'EXPENSE'
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
          } focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          {isLoading ? 'Saving...' : `Add ${formData.type === 'EXPENSE' ? 'Expense' : 'Income'}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}