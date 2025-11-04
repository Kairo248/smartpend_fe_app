'use client';

import { Plus, PieChart, Target, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface QuickActionsProps {
  onDataChange: () => void;
}

export default function QuickActions({ onDataChange }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    {
      name: 'Add Expense',
      description: 'Record a new expense',
      href: '/expenses/new',
      icon: PieChart,
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      name: 'Add Income',
      description: 'Record income or refund',
      href: '/expenses/new?type=income',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Create Budget',
      description: 'Set spending limits',
      href: '/budgets/new',
      icon: Target,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'Add Wallet',
      description: 'Create new wallet',
      href: '/wallets/new',
      icon: Wallet,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <div className="relative">
      {/* Quick Actions Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-5 w-5 mr-2" />
        Quick Actions
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu Content */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <Link
                      key={action.name}
                      href={action.href}
                      onClick={() => setIsOpen(false)}
                      className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color} mb-2 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 text-center">
                        {action.name}
                      </span>
                      <span className="text-xs text-gray-500 text-center mt-1">
                        {action.description}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Or use keyboard shortcuts
                </span>
                <div className="flex space-x-2">
                  <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">Ctrl</kbd>
                  <span className="text-xs text-gray-400">+</span>
                  <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">N</kbd>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}