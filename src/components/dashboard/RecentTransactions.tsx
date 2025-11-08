'use client';

import { Receipt, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatAmount, DEFAULT_CURRENCY } from '@/lib/currency';

interface RecentTransactionsProps {
  transactions: Array<{
    id: number;
    description: string;
    amount: number;
    type: 'EXPENSE' | 'INCOME';
    categoryName: string;
    categoryColor: string;
    walletName: string;
    date: string;
  }>;
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return formatAmount(amount, DEFAULT_CURRENCY);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getInitials = (text: string) => {
    return text.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h3>
          <Link
            href="/expenses"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-1" />
            View All
          </Link>
        </div>

        {transactions && transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center space-x-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* Category Icon */}
                <div 
                  className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: transaction.categoryColor }}
                >
                  {getInitials(transaction.categoryName)}
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {transaction.description}
                    </p>
                    <div className="flex items-center">
                      {transaction.type === 'INCOME' ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-semibold ${
                        transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{transaction.categoryName}</span>
                      <span>•</span>
                      <span>{transaction.walletName}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Receipt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No recent transactions
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first expense or income entry.
            </p>
            <div className="mt-6">
              <Link
                href="/expenses/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Receipt className="-ml-1 mr-2 h-5 w-5" />
                Add Transaction
              </Link>
            </div>
          </div>
        )}

        {/* Quick Summary */}
        {transactions && transactions.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Showing {transactions.length} recent transactions
              </span>
              <Link
                href="/expenses"
                className="text-blue-600 hover:text-blue-800"
              >
                View transaction history →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}