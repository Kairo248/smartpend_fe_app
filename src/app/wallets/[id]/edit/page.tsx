'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import WalletForm, { WalletFormData } from '@/components/wallets/WalletForm';
import { api } from '@/lib/api';
import { Wallet, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

export default function EditWalletPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const walletId = params?.id as string;
  
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && walletId) {
      fetchWallet();
    }
  }, [user, walletId]);

  const fetchWallet = async () => {
    try {
      setIsLoadingWallet(true);
      const response = await api.get(`/wallets/${walletId}`);
      setWallet(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching wallet:', err);
      if (err.response?.status === 404) {
        setError('Wallet not found');
      } else {
        setError(err.response?.data?.message || 'Failed to load wallet');
      }
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const handleSubmit = async (formData: WalletFormData) => {
    if (!user || !walletId) return;

    try {
      setIsLoading(true);
      setError(null);

      const walletData = {
        name: formData.name,
        currency: formData.currency,
        balance: formData.balance,
        description: formData.description || '',
        isDefault: formData.isDefault || false,
        isActive: true,
      };

      console.log('Updating wallet:', walletData);
      
      const response = await api.put(`/wallets/${walletId}`, walletData);
      
      console.log('Wallet updated successfully:', response.data);
      
      // Redirect to wallets page on success
      router.push('/wallets?updated=true');
      
    } catch (err: any) {
      console.error('Error updating wallet:', err);
      setError(err.response?.data?.message || 'Failed to update wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/wallets');
  };

  if (isLoadingWallet) {
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

  if (error && !wallet) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Wallet</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link
                href="/wallets"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Wallets
              </Link>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!wallet) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600">Wallet not found</p>
              <Link
                href="/wallets"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Wallets
              </Link>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const initialData: Partial<WalletFormData> = {
    name: wallet.name,
    currency: wallet.currency,
    balance: wallet.balance,
    description: wallet.description || '',
    isDefault: wallet.isDefault,
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/wallets"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Wallet className="h-8 w-8 mr-3 text-blue-600" />
                  Edit Wallet
                </h1>
                <p className="text-gray-600">Update your wallet details</p>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/wallets" className="text-gray-400 hover:text-gray-500">
                  Wallets
                </Link>
              </li>
              <li className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-500 font-medium">{wallet.name}</span>
              </li>
              <li className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-500 font-medium">Edit</span>
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
              <h2 className="text-lg font-medium text-gray-900">Update Wallet Information</h2>
              <p className="text-sm text-gray-500">Modify the information below to update your wallet</p>
            </div>
            
            <div className="px-6 py-6">
              <WalletForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isLoading}
                initialData={initialData}
              />
            </div>
          </div>

          {/* Wallet Info Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-gray-800 text-sm font-medium mb-2">Wallet Details</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900">{new Date(wallet.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="text-gray-900">{new Date(wallet.updatedAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Status</dt>
                <dd className={`${wallet.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {wallet.isActive ? 'Active' : 'Inactive'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Default Wallet</dt>
                <dd className={`${wallet.isDefault ? 'text-blue-600' : 'text-gray-600'}`}>
                  {wallet.isDefault ? 'Yes' : 'No'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}