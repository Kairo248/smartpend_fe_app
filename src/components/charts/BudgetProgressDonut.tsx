'use client';

import DonutChart, { DonutChartData } from './DonutChart';
import { formatAmount, DEFAULT_CURRENCY } from '@/lib/currency';

interface BudgetProgressDonutProps {
  spentAmount: number;
  totalAmount: number;
  size?: number;
  thickness?: number;
  showLegend?: boolean;
  className?: string;
}

export default function BudgetProgressDonut({
  spentAmount,
  totalAmount,
  size = 120,
  thickness = 20,
  showLegend = false,
  className = ''
}: BudgetProgressDonutProps) {
  const remainingAmount = Math.max(0, totalAmount - spentAmount);
  const overAmount = Math.max(0, spentAmount - totalAmount);
  const isOverBudget = spentAmount > totalAmount;
  
  const spentPercentage = totalAmount > 0 ? (spentAmount / totalAmount) * 100 : 0;
  
  const data: DonutChartData[] = [];
  
  if (isOverBudget) {
    // Over budget - show budget amount and over amount
    data.push(
      {
        label: 'Budget',
        value: totalAmount,
        color: '#EF4444' // Red
      },
      {
        label: 'Over Budget',
        value: overAmount,
        color: '#DC2626' // Darker red
      }
    );
  } else {
    // Within budget - show spent and remaining
    data.push(
      {
        label: 'Spent',
        value: spentAmount,
        color: spentPercentage >= 90 ? '#EF4444' : spentPercentage >= 80 ? '#F59E0B' : '#10B981'
      },
      {
        label: 'Remaining',
        value: remainingAmount,
        color: '#E5E7EB' // Light gray
      }
    );
  }
  
  // Filter out zero values
  const filteredData = data.filter(item => item.value > 0);
  
  const centerText = `${spentPercentage.toFixed(0)}%`;
  const centerSubtext = isOverBudget ? 'Over Budget' : 'Used';
  
  return (
    <DonutChart
      data={filteredData}
      size={size}
      thickness={thickness}
      showLegend={showLegend}
      showLabels={false}
      showPercentages={false}
      centerText={centerText}
      centerSubtext={centerSubtext}
      className={className}
    />
  );
}

// Component for larger budget progress displays
export function DetailedBudgetProgressDonut({
  spentAmount,
  totalAmount,
  budgetName,
  size = 200,
  className = ''
}: BudgetProgressDonutProps & { budgetName?: string }) {
  const remainingAmount = Math.max(0, totalAmount - spentAmount);
  const overAmount = Math.max(0, spentAmount - totalAmount);
  const isOverBudget = spentAmount > totalAmount;
  
  const spentPercentage = totalAmount > 0 ? (spentAmount / totalAmount) * 100 : 0;
  
  const data: DonutChartData[] = [];
  
  if (isOverBudget) {
    data.push(
      {
        label: 'Budget Amount',
        value: totalAmount,
        color: '#F59E0B' // Amber
      },
      {
        label: 'Over Budget',
        value: overAmount,
        color: '#EF4444' // Red
      }
    );
  } else {
    if (spentAmount > 0) {
      data.push({
        label: 'Spent',
        value: spentAmount,
        color: spentPercentage >= 90 ? '#EF4444' : spentPercentage >= 80 ? '#F59E0B' : '#10B981'
      });
    }
    if (remainingAmount > 0) {
      data.push({
        label: 'Remaining',
        value: remainingAmount,
        color: '#E5E7EB'
      });
    }
  }
  
  const centerText = formatAmount(spentAmount, DEFAULT_CURRENCY);
  const centerSubtext = `of ${formatAmount(totalAmount, DEFAULT_CURRENCY)}`;
  
  return (
    <div className={`text-center ${className}`}>
      {budgetName && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{budgetName}</h3>
      )}
      <DonutChart
        data={data}
        size={size}
        thickness={30}
        showLegend={true}
        showLabels={false}
        showPercentages={true}
        centerText={centerText}
        centerSubtext={centerSubtext}
      />
      <div className="mt-4 text-center">
        <div className={`text-lg font-semibold ${isOverBudget ? 'text-red-600' : spentPercentage >= 90 ? 'text-red-600' : spentPercentage >= 80 ? 'text-yellow-600' : 'text-green-600'}`}>
          {spentPercentage.toFixed(1)}% Used
        </div>
        {isOverBudget && (
          <div className="text-sm text-red-600 mt-1">
            {formatAmount(overAmount, DEFAULT_CURRENCY)} over budget
          </div>
        )}
      </div>
    </div>
  );
}