'use client';

import { Filter, SortAsc } from 'lucide-react';

interface BudgetFiltersProps {
  filter: 'all' | 'active' | 'over' | 'alerting';
  setFilter: (filter: 'all' | 'active' | 'over' | 'alerting') => void;
  sortBy: 'name' | 'amount' | 'spent' | 'remaining';
  setSortBy: (sortBy: 'name' | 'amount' | 'spent' | 'remaining') => void;
  budgetCount: number;
}

export default function BudgetFilters({ 
  filter, 
  setFilter, 
  sortBy, 
  setSortBy, 
  budgetCount 
}: BudgetFiltersProps) {
  const filterOptions = [
    { key: 'all', label: 'All Budgets', description: 'Show all budgets' },
    { key: 'active', label: 'Active', description: 'Currently active budgets' },
    { key: 'over', label: 'Over Budget', description: 'Budgets that are exceeded' },
    { key: 'alerting', label: 'Need Attention', description: 'Budgets with alerts' },
  ];

  const sortOptions = [
    { key: 'name', label: 'Name' },
    { key: 'amount', label: 'Budget Amount' },
    { key: 'spent', label: 'Amount Spent' },
    { key: 'remaining', label: 'Remaining' },
  ];

  return (
    <div className="bg-white shadow rounded-lg border border-gray-200">
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Filter Tabs */}
          <div className="flex items-center space-x-1">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <div className="flex rounded-md border border-gray-300 overflow-hidden">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key as any)}
                  className={`px-4 py-2 text-sm font-medium border-r border-gray-300 last:border-r-0 ${
                    filter === option.key
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title={option.description}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown and Results Count */}
          <div className="flex items-center space-x-4">
            {/* Results Count */}
            <span className="text-sm text-gray-600">
              {budgetCount} budget{budgetCount !== 1 ? 's' : ''}
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <SortAsc className="h-4 w-4 text-gray-400" />
              <label htmlFor="sort-select" className="text-sm text-gray-600">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filter Description */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {filterOptions.find(opt => opt.key === filter)?.description}
            {budgetCount > 0 && (
              <span className="ml-2">
                • Sorted by {sortOptions.find(opt => opt.key === sortBy)?.label.toLowerCase()}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}