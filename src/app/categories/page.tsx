'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import CategoryModal from '@/components/categories/CategoryModal';
import DeleteConfirmation from '@/components/ui/DeleteConfirmation';
import { AVAILABLE_ICONS } from '@/components/ui/IconPicker';
import { api } from '@/lib/api';
import { formatAmount, DEFAULT_CURRENCY } from '@/lib/currency';
import { Tag, Plus, Edit, Trash2, Circle, RefreshCw } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  expenseCount?: number;
  totalAmount?: number;
}

interface CategoryFormData {
  name: string;
  color: string;
  icon: string;
  description: string;
}

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (data: CategoryFormData) => {
    try {
      const response = await api.post('/categories', data);
      setCategories(prev => [...prev, response.data]);
      setModalOpen(false);
    } catch (err: any) {
      console.error('Error creating category:', err);
      throw new Error(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleEditCategory = async (data: CategoryFormData) => {
    if (!editingCategory) return;
    
    try {
      const response = await api.put(`/categories/${editingCategory.id}`, data);
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id ? response.data : cat
      ));
      setEditingCategory(null);
      setModalOpen(false);
    } catch (err: any) {
      console.error('Error updating category:', err);
      throw new Error(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      await api.delete(`/categories/${categoryToDelete.id}`);
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
      setCategoryToDelete(null);
      setDeleteConfirmOpen(false);
    } catch (err: any) {
      console.error('Error deleting category:', err);
      throw new Error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    if (category.isSystem) {
      alert('System categories cannot be edited');
      return;
    }
    setEditingCategory(category);
    setModalOpen(true);
  };

  const openDeleteConfirm = (category: Category) => {
    if (category.isSystem) {
      alert('System categories cannot be deleted');
      return;
    }
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const getIconComponent = (iconName: string) => {
    const iconData = AVAILABLE_ICONS.find(icon => icon.name === iconName);
    return iconData?.icon || Circle;
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

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600">Organize your expenses with custom categories</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={fetchCategories}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button 
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">{error}</div>
              <button
                onClick={fetchCategories}
                className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {/* Categories Grid */}
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first category.</p>
              <div className="mt-6">
                <button 
                  onClick={openCreateModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <div key={category.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: category.color }}
                        >
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                            {category.isSystem && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                System
                              </span>
                            )}
                          </div>
                          {category.description && (
                            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openEditModal(category)}
                          className={`text-gray-400 hover:text-blue-600 ${
                            category.isSystem ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={category.isSystem}
                          title={category.isSystem ? 'System categories cannot be edited' : 'Edit category'}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteConfirm(category)}
                          className={`text-gray-400 hover:text-red-600 ${
                            category.isSystem ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={category.isSystem}
                          title={category.isSystem ? 'System categories cannot be deleted' : 'Delete category'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Total Spent</p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatAmount(category.totalAmount || 0, DEFAULT_CURRENCY)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Transactions</p>
                          <p className="text-xl font-bold text-gray-900">
                            {category.expenseCount || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <p className="text-xs text-gray-500">
                        Created {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Category Modal */}
          <CategoryModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setEditingCategory(null);
            }}
            onSubmit={editingCategory ? handleEditCategory : handleCreateCategory}
            category={editingCategory}
            mode={editingCategory ? 'edit' : 'create'}
          />

          {/* Delete Confirmation */}
          <DeleteConfirmation
            isOpen={deleteConfirmOpen}
            onClose={() => {
              setDeleteConfirmOpen(false);
              setCategoryToDelete(null);
            }}
            onConfirm={handleDeleteCategory}
            title="Delete Category"
            message="Are you sure you want to delete this category? This action cannot be undone and will affect all associated expenses."
            itemName={categoryToDelete?.name}
            isDestructive={true}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}