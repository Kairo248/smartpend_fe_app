'use client';

import DonutChart, { DonutChartData, generateChartColors } from './DonutChart';
import { formatAmount, DEFAULT_CURRENCY } from '@/lib/currency';

interface CategoryData {
  categoryName: string;
  totalAmount: number;
  percentage: number;
  color?: string;
}

interface CategoryBreakdownDonutProps {
  categories: CategoryData[];
  totalAmount?: number;
  size?: number;
  thickness?: number;
  showLegend?: boolean;
  maxCategories?: number;
  title?: string;
  className?: string;
}

export default function CategoryBreakdownDonut({
  categories,
  totalAmount,
  size = 240,
  thickness = 40,
  showLegend = true,
  maxCategories = 8,
  title,
  className = ''
}: CategoryBreakdownDonutProps) {
  // Calculate total if not provided
  const calculatedTotal = totalAmount || categories.reduce((sum, cat) => sum + cat.totalAmount, 0);
  
  // Sort categories by amount (descending)
  const sortedCategories = [...categories].sort((a, b) => b.totalAmount - a.totalAmount);
  
  // Take top categories and group others
  let displayCategories = sortedCategories.slice(0, maxCategories - 1);
  const otherCategories = sortedCategories.slice(maxCategories - 1);
  
  if (otherCategories.length > 0) {
    const otherTotal = otherCategories.reduce((sum, cat) => sum + cat.totalAmount, 0);
    displayCategories.push({
      categoryName: 'Others',
      totalAmount: otherTotal,
      percentage: (otherTotal / calculatedTotal) * 100,
      color: '#9CA3AF' // Gray
    });
  }
  
  // Generate colors
  const colors = generateChartColors(displayCategories.length);
  
  const data: DonutChartData[] = displayCategories.map((category, index) => ({
    label: category.categoryName,
    value: category.totalAmount,
    color: category.color || colors[index],
    percentage: (category.totalAmount / calculatedTotal) * 100
  }));
  
  const centerText = formatAmount(calculatedTotal, DEFAULT_CURRENCY);
  const centerSubtext = 'Total Spent';
  
  return (
    <div className={`text-center ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <DonutChart
        data={data}
        size={size}
        thickness={thickness}
        showLegend={showLegend}
        showLabels={false}
        showPercentages={false}
        centerText={centerText}
        centerSubtext={centerSubtext}
      />
    </div>
  );
}

// Simplified version for smaller displays
export function CompactCategoryDonut({
  categories,
  size = 120,
  className = ''
}: Pick<CategoryBreakdownDonutProps, 'categories' | 'size' | 'className'>) {
  const total = categories.reduce((sum, cat) => sum + cat.totalAmount, 0);
  const topCategory = categories.sort((a, b) => b.totalAmount - a.totalAmount)[0];
  
  if (!topCategory || total === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <div className="text-center text-gray-400">
          <div className="text-sm">No Data</div>
        </div>
      </div>
    );
  }
  
  const colors = generateChartColors(categories.length);
  const data: DonutChartData[] = categories.map((category, index) => ({
    label: category.categoryName,
    value: category.totalAmount,
    color: category.color || colors[index]
  }));
  
  const centerText = `${((topCategory.totalAmount / total) * 100).toFixed(0)}%`;
  const centerSubtext = topCategory.categoryName;
  
  return (
    <div className={className}>
      <DonutChart
        data={data}
        size={size}
        thickness={20}
        showLegend={false}
        showLabels={false}
        showPercentages={false}
        centerText={centerText}
        centerSubtext={centerSubtext}
      />
    </div>
  );
}