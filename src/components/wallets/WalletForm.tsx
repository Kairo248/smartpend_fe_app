'use client';

import { useState, useEffect } from 'react';
import { Wallet, DollarSign, FileText } from 'lucide-react';

interface WalletFormProps {
  onSubmit: (formData: WalletFormData) => void;
  onCancel: () => void;
  initialData?: Partial<WalletFormData>;
  isLoading?: boolean;
}

export interface WalletFormData {
  name: string;
  currency: string;
  balance: number;
  description?: string;
  isDefault?: boolean;
}

interface FormErrors {
  name?: string;
  currency?: string;
  balance?: string;
  description?: string;
}

export default function WalletForm({ onSubmit, onCancel, initialData, isLoading = false }: WalletFormProps) {
  const [formData, setFormData] = useState<WalletFormData>({
    name: '',
    currency: 'USD',
    balance: 0,
    description: '',
    isDefault: false,
    ...initialData,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const updateFormData = (field: keyof WalletFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Wallet name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Wallet name must not exceed 100 characters';
    }

    if (!formData.currency.trim()) {
      newErrors.currency = 'Currency is required';
    } else if (formData.currency.length !== 3) {
      newErrors.currency = 'Currency must be 3 characters (e.g., USD)';
    }

    if (formData.balance < 0) {
      newErrors.balance = 'Balance cannot be negative';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const currencyOptions = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Wallet Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Wallet className="inline h-4 w-4 mr-1" />
          Wallet Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          placeholder="Enter wallet name (e.g., Main Account, Credit Card, Cash)"
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Currency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="inline h-4 w-4 mr-1" />
          Currency *
        </label>
        <select
          value={formData.currency}
          onChange={(e) => updateFormData('currency', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.currency ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        >
          {currencyOptions.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.symbol} - {currency.name} ({currency.code})
            </option>
          ))}
        </select>
        {errors.currency && (
          <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
        )}
      </div>

      {/* Initial Balance */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="inline h-4 w-4 mr-1" />
          Initial Balance *
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.balance}
            onChange={(e) => updateFormData('balance', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.balance ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500 text-sm">
              {currencyOptions.find(c => c.code === formData.currency)?.symbol || formData.currency}
            </span>
          </div>
        </div>
        {errors.balance && (
          <p className="mt-1 text-sm text-red-600">{errors.balance}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Enter the current balance of this wallet or account
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="inline h-4 w-4 mr-1" />
          Description (Optional)
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Add a description for this wallet (optional)"
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.description?.length || 0}/500 characters
        </p>
      </div>

      {/* Default Wallet Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault || false}
          onChange={(e) => updateFormData('isDefault', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={isLoading}
        />
        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
          Set as default wallet
        </label>
      </div>
      <p className="text-sm text-gray-500 ml-6">
        The default wallet will be pre-selected when creating new transactions
      </p>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Wallet'
          )}
        </button>
      </div>
    </form>
  );
}