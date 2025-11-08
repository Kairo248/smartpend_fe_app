'use client';

import { useState, useEffect } from 'react';
import { Calendar, Banknote, AlertTriangle, FileText, Target, Clock } from 'lucide-react';
import { api } from '@/lib/api';

interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
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

interface BudgetFormProps {
  initialData?: Partial<BudgetFormData>;
  budgetId?: number;
  onSubmit: (data: BudgetFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function BudgetForm({
  initialData,
  budgetId,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Create Budget'
}: BudgetFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    amount: 0,
    categoryId: 0,
    period: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    alertThreshold: 80,
    alertEnabled: true,
    description: '',
    ...initialData
  });

  useEffect(() => {
    fetchCategories();
    if (formData.period !== 'CUSTOM') {
      calculateEndDate();
    }
  }, []);

  useEffect(() => {
    if (formData.period !== 'CUSTOM') {
      calculateEndDate();
    }
  }, [formData.startDate, formData.period]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
      // Only set default category if not already set and no initial data was provided
      if (response.data.length > 0 && formData.categoryId === 0 && !initialData?.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const calculateEndDate = () => {
    if (!formData.startDate) return;

    const startDate = new Date(formData.startDate);
    let endDate = new Date(startDate);

    switch (formData.period) {
      case 'WEEKLY':
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'MONTHLY':
        endDate.setMonth(startDate.getMonth() + 1);
        break;
      case 'QUARTERLY':
        endDate.setMonth(startDate.getMonth() + 3);
        break;
      case 'YEARLY':
        endDate.setFullYear(startDate.getFullYear() + 1);
        break;
      default:
        return;
    }

    setFormData(prev => ({
      ...prev,
      endDate: endDate.toISOString().split('T')[0]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Budget name is required';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Budget amount must be greater than 0';
    }

    // Note: categoryId can be 0 for "overall budget" (no specific category)
    // This is a valid option, so we don't validate this field

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.alertThreshold < 0 || formData.alertThreshold > 100) {
      newErrors.alertThreshold = 'Alert threshold must be between 0 and 100';
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

  const handleInputChange = (field: keyof BudgetFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Budget Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            <Target className="inline h-4 w-4 mr-1" />
            Budget Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Monthly Groceries, Travel Fund"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Budget Amount and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              <Banknote className="inline h-4 w-4 mr-1" />
              Budget Amount
            </label>
            <input
              type="number"
              id="amount"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.categoryId}
              onChange={(e) => handleInputChange('categoryId', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loadingCategories}
            >
              <option value={0}>📊 Overall Budget (All Categories)</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {errors.categoryId}
              </p>
            )}
            {selectedCategory && (
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                {selectedCategory.name}
              </div>
            )}
          </div>
        </div>

        {/* Budget Period */}
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline h-4 w-4 mr-1" />
            Budget Period
          </label>
          <select
            id="period"
            value={formData.period}
            onChange={(e) => handleInputChange('period', e.target.value as BudgetFormData['period'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
            <option value="CUSTOM">Custom Period</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {errors.startDate}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.endDate ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={formData.period !== 'CUSTOM'}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {errors.endDate}
              </p>
            )}
            {formData.period !== 'CUSTOM' && (
              <p className="mt-1 text-xs text-gray-500">
                End date is automatically calculated based on the selected period
              </p>
            )}
          </div>
        </div>

        {/* Alert Settings */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="alertEnabled"
              checked={formData.alertEnabled}
              onChange={(e) => handleInputChange('alertEnabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="alertEnabled" className="ml-2 block text-sm text-gray-700">
              <AlertTriangle className="inline h-4 w-4 mr-1" />
              Enable budget alerts
            </label>
          </div>

          {formData.alertEnabled && (
            <div>
              <label htmlFor="alertThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                Alert Threshold ({formData.alertThreshold}%)
              </label>
              <input
                type="range"
                id="alertThreshold"
                min="0"
                max="100"
                step="5"
                value={formData.alertThreshold}
                onChange={(e) => handleInputChange('alertThreshold', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Get notified when you've spent {formData.alertThreshold}% of your budget
              </p>
              {errors.alertThreshold && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {errors.alertThreshold}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add notes about this budget..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {budgetId ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>
    </div>
  );
}