'use client';

import { useState, useEffect } from 'react';
import ColorPicker from '@/components/ui/ColorPicker';
import IconPicker from '@/components/ui/IconPicker';

interface CategoryFormData {
  name: string;
  color: string;
  icon: string;
  description: string;
}

interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitText?: string;
}

export default function CategoryForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  submitText = 'Create Category'
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || '',
    color: initialData?.color || '#6B7280',
    icon: initialData?.icon || 'more-horizontal',
    description: initialData?.description || ''
  });

  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CategoryFormData, boolean>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        color: initialData.color || '#6B7280',
        icon: initialData.icon || 'more-horizontal',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Category name must not exceed 100 characters';
    }

    // Color validation
    if (!formData.color) {
      newErrors.color = 'Color is required';
    } else if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formData.color)) {
      newErrors.color = 'Please enter a valid hex color';
    }

    // Icon validation
    if (!formData.icon) {
      newErrors.icon = 'Icon is required';
    }

    // Description validation (optional but with length limit)
    if (formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleBlur = (field: keyof CategoryFormData) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      color: true,
      icon: true,
      description: true
    });

    if (validateForm()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  };

  const getFieldError = (field: keyof CategoryFormData) => {
    return touched[field] && errors[field];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Category Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder="Enter category name"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            getFieldError('name') 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500'
          }`}
          disabled={isLoading}
        />
        {getFieldError('name') && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Category Color */}
      <div>
        <ColorPicker
          value={formData.color}
          onChange={(color) => handleInputChange('color', color)}
          className={getFieldError('color') ? 'text-red-600' : ''}
        />
        {getFieldError('color') && (
          <p className="mt-1 text-sm text-red-600">{errors.color}</p>
        )}
      </div>

      {/* Category Icon */}
      <div>
        <IconPicker
          value={formData.icon}
          onChange={(icon) => handleInputChange('icon', icon)}
          className={getFieldError('icon') ? 'text-red-600' : ''}
        />
        {getFieldError('icon') && (
          <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
        )}
      </div>

      {/* Category Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Enter category description"
          rows={3}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            getFieldError('description') 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500'
          }`}
          disabled={isLoading}
        />
        <div className="mt-1 flex justify-between">
          {getFieldError('description') ? (
            <p className="text-sm text-red-600">{errors.description}</p>
          ) : (
            <p className="text-sm text-gray-500">
              Provide additional details about this category
            </p>
          )}
          <p className="text-sm text-gray-400">
            {formData.description.length}/500
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {submitText}
        </button>
      </div>
    </form>
  );
}