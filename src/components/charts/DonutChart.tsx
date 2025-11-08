'use client';

import { useMemo } from 'react';

export interface DonutChartData {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

interface DonutChartProps {
  data: DonutChartData[];
  size?: number;
  thickness?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  showPercentages?: boolean;
  centerText?: string;
  centerSubtext?: string;
  className?: string;
}

export default function DonutChart({
  data,
  size = 200,
  thickness = 40,
  showLegend = true,
  showLabels = false,
  showPercentages = true,
  centerText,
  centerSubtext,
  className = ''
}: DonutChartProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const processedData = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentOffset = 0;

    return data.map(item => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const strokeDasharray = (percentage / 100) * circumference;
      const strokeDashoffset = currentOffset;
      
      currentOffset -= strokeDasharray;
      
      return {
        ...item,
        percentage,
        strokeDasharray,
        strokeDashoffset
      };
    });
  }, [data, circumference]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={thickness}
          />
          
          {/* Data segments */}
          {processedData.map((segment, index) => (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={thickness}
              strokeDasharray={`${segment.strokeDasharray} ${circumference}`}
              strokeDashoffset={segment.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-in-out"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
          ))}
        </svg>

        {/* Center text */}
        {(centerText || centerSubtext) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerText && (
              <div className="text-2xl font-bold text-gray-900">
                {centerText}
              </div>
            )}
            {centerSubtext && (
              <div className="text-sm text-gray-500 text-center">
                {centerSubtext}
              </div>
            )}
          </div>
        )}

        {/* Data labels on chart */}
        {showLabels && (
          <div className="absolute inset-0">
            {processedData.map((segment, index) => {
              if (segment.percentage < 5) return null; // Don't show labels for very small segments
              
              const angle = (segment.strokeDashoffset / circumference) * 360 - (segment.strokeDasharray / circumference) * 180;
              const labelRadius = radius + thickness / 2;
              const x = center + labelRadius * Math.cos((angle * Math.PI) / 180);
              const y = center + labelRadius * Math.sin((angle * Math.PI) / 180);
              
              return (
                <div
                  key={index}
                  className="absolute text-xs font-medium text-gray-700 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: x,
                    top: y
                  }}
                >
                  {showPercentages ? `${segment.percentage.toFixed(1)}%` : segment.label}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-md">
          {processedData.map((segment, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-600">
                {segment.label}
                {showPercentages && segment.percentage > 0 && (
                  <span className="text-gray-500 ml-1">
                    ({segment.percentage.toFixed(1)}%)
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to generate colors
export const generateChartColors = (count: number): string[] => {
  const baseColors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280'  // Gray
  ];
  
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    if (i < baseColors.length) {
      colors.push(baseColors[i]);
    } else {
      // Generate additional colors by varying the base colors
      const baseIndex = i % baseColors.length;
      const variation = Math.floor(i / baseColors.length);
      const hsl = hexToHsl(baseColors[baseIndex]);
      const newColor = hslToHex(
        hsl.h,
        Math.max(0.3, hsl.s - variation * 0.1),
        Math.min(0.9, hsl.l + variation * 0.1)
      );
      colors.push(newColor);
    }
  }
  
  return colors;
};

// Helper functions for color manipulation
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return { h: h * 360, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}