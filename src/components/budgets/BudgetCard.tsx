'use client';

import { useState } from 'react';
import { Edit, Trash2, AlertTriangle, Calendar, Target, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { formatAmount, DEFAULT_CURRENCY } from '@/lib/currency';

interface Budget {
  id: number;
  name: string;
  amount: number;
  spentAmount: number;
  remainingAmount: number;
  spentPercentage: number;
  category: {
    id: number;
    name: string;
    color: string;
    icon: string;
  } | null;
  period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
  startDate: string;
  endDate: string;
  isActive: boolean;
  alertThreshold: number;
  alertEnabled: boolean;
  description: string;
  isOverBudget: boolean;
  shouldAlert: boolean;
  isExpired: boolean;
  daysRemaining: number;
}

interface BudgetCardProps {
  budget: Budget;
  onDelete: (id: number) => void;
  onUpdate: () => void;
}

export default function BudgetCard({ budget, onDelete, onUpdate }: BudgetCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatCurrency = (amount: number) => {
    return formatAmount(amount, DEFAULT_CURRENCY);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getProgressColor = () => {
    if (budget.isOverBudget) return 'bg-red-500';
    if (budget.spentPercentage >= 90) return 'bg-red-400';
    if (budget.spentPercentage >= budget.alertThreshold) return 'bg-yellow-400';
    return 'bg-blue-500';
  };

  const getStatusColor = () => {
    if (budget.isOverBudget) return 'text-red-600 bg-red-50 border-red-200';
    if (budget.shouldAlert) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (budget.isExpired) return 'text-gray-600 bg-gray-50 border-gray-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStatusText = () => {
    console.log(`Budget "${budget.name}" debug:`, {
      spentAmount: budget.spentAmount,
      budgetAmount: budget.amount,
      spentPercentage: budget.spentPercentage,
      isOverBudget: budget.isOverBudget,
      shouldAlert: budget.shouldAlert,
      alertThreshold: budget.alertThreshold,
      isExpired: budget.isExpired
    });
    
    if (budget.isOverBudget) return 'Over Budget';
    if (budget.shouldAlert) return 'Needs Attention';
    if (budget.isExpired) return 'Expired';
    return 'On Track';
  };

  const getCategoryInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-white shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Category Icon */}
            {budget.category ? (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: budget.category.color }}
              >
                {getCategoryInitials(budget.category.name)}
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
                <Target className="h-5 w-5" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {budget.name}
              </h3>
              <p className="text-sm text-gray-500">
                {budget.category?.name || 'Overall Budget'}
              </p>
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    <Link
                      href={`/budgets/${budget.id}/edit`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowMenu(false)}
                    >
                      <Edit className="h-4 w-4 mr-3" />
                      Edit Budget
                    </Link>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(budget.id);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-3" />
                      Delete Budget
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-4 ${getStatusColor()}`}>
          {budget.isOverBudget && <AlertTriangle className="h-3 w-3 mr-1" />}
          {getStatusText()}
        </div>

        {/* Amount Information */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-semibold text-gray-900">
              {formatCurrency(budget.spentAmount)}
            </span>
            <span className="text-sm text-gray-500">
              of {formatCurrency(budget.amount)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>
              Remaining: {formatCurrency(budget.remainingAmount)}
            </span>
            <span>
              {budget.spentPercentage.toFixed(1)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(budget.spentPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Period and Days Remaining */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="capitalize">{budget.period.toLowerCase()}</span>
          </div>
          <span>
            {budget.daysRemaining > 0 ? (
              `${budget.daysRemaining} days left`
            ) : budget.isExpired ? (
              'Expired'
            ) : (
              'Ending soon'
            )}
          </span>
        </div>

        {/* Description */}
        {budget.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {budget.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
          <span>
            {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
          </span>
          {budget.alertEnabled && (
            <div className="flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Alert at {budget.alertThreshold}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}