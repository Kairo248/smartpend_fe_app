'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { Wallet, Plus, Edit, Trash2, CreditCard, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface WalletData {
  id: number;
  name: string;
  currency: string;
  balance: number;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function WalletsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchWallets();
    }
    
    // Check for success message from URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setShowSuccess(true);
      setSuccessMessage('Wallet created successfully!');
      // Remove the parameter from URL without causing a reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } else if (urlParams.get('updated') === 'true') {
      setShowSuccess(true);
      setSuccessMessage('Wallet updated successfully!');
      // Remove the parameter from URL without causing a reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [user]);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/wallets');
      setWallets(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching wallets:', err);
      setError(err.response?.data?.message || 'Failed to load wallets');
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  const handleDeleteWallet = async (walletId: number, walletName: string) => {
    if (!confirm(`Are you sure you want to delete "${walletName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(walletId);
      await api.delete(`/wallets/${walletId}`);
      
      // Remove wallet from local state
      setWallets(prev => prev.filter(w => w.id !== walletId));
      
      // Show success message
      setShowSuccess(true);
      setSuccessMessage('Wallet deleted successfully!');
      setTimeout(() => setShowSuccess(false), 5000);
      
    } catch (err: any) {
      console.error('Error deleting wallet:', err);
      setError(err.response?.data?.message || 'Failed to delete wallet');
    } finally {
      setDeleteLoading(null);
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Wallets</h1>
              <p className="text-gray-600">Manage your wallets and accounts</p>
            </div>
            <Link
              href="/wallets/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Wallet
            </Link>
          </div>

          {/* Total Balance Card */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 mr-3" />
              <div>
                <p className="text-blue-100 text-sm">Total Balance</p>
                <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-green-800 text-sm">{successMessage}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="text-green-400 hover:text-green-600"
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

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">{error}</div>
              <button
                onClick={fetchWallets}
                className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {/* Wallets Grid */}
          {wallets.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No wallets</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new wallet.</p>
              <div className="mt-6">
                <Link
                  href="/wallets/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Wallet
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-8 w-8 text-blue-500 mr-3" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{wallet.name}</h3>
                        <p className="text-sm text-gray-500">{wallet.currency}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/wallets/${wallet.id}/edit`}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteWallet(wallet.id, wallet.name)}
                        disabled={deleteLoading === wallet.id}
                        className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                      >
                        {deleteLoading === wallet.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900">
                      ${wallet.balance.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{wallet.currency}</p>
                    {wallet.description && (
                      <p className="text-sm text-gray-600 mt-1">{wallet.description}</p>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {wallet.isDefault && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Default
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        wallet.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {wallet.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Created {new Date(wallet.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}