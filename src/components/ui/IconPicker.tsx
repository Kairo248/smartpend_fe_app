'use client';

import { useState } from 'react';
import {
  Utensils, Car, Gamepad, ShoppingBag, Receipt, Heart,
  Book, Plane, DollarSign, MoreHorizontal, Home, Coffee,
  Fuel, Bus, Film, Shirt, Zap, Phone, GraduationCap,
  MapPin, TrendingUp, Gift, Music, Camera, Laptop,
  Dumbbell, PaintBucket, Wrench, Briefcase, CreditCard,
  Wifi, Pizza, Headphones, Watch, Smartphone, Globe
} from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  className?: string;
}

// Icon mapping with display names
const AVAILABLE_ICONS = [
  { name: 'utensils', icon: Utensils, label: 'Food & Dining' },
  { name: 'car', icon: Car, label: 'Transportation' },
  { name: 'gamepad', icon: Gamepad, label: 'Entertainment' },
  { name: 'shopping-bag', icon: ShoppingBag, label: 'Shopping' },
  { name: 'receipt', icon: Receipt, label: 'Bills' },
  { name: 'heart', icon: Heart, label: 'Healthcare' },
  { name: 'book', icon: Book, label: 'Education' },
  { name: 'plane', icon: Plane, label: 'Travel' },
  { name: 'dollar-sign', icon: DollarSign, label: 'Income' },
  { name: 'more-horizontal', icon: MoreHorizontal, label: 'Other' },
  { name: 'home', icon: Home, label: 'Home' },
  { name: 'coffee', icon: Coffee, label: 'Coffee' },
  { name: 'fuel', icon: Fuel, label: 'Fuel' },
  { name: 'bus', icon: Bus, label: 'Public Transport' },
  { name: 'film', icon: Film, label: 'Movies' },
  { name: 'shirt', icon: Shirt, label: 'Clothing' },
  { name: 'zap', icon: Zap, label: 'Electricity' },
  { name: 'phone', icon: Phone, label: 'Phone Bills' },
  { name: 'graduation-cap', icon: GraduationCap, label: 'Learning' },
  { name: 'map-pin', icon: MapPin, label: 'Location' },
  { name: 'trending-up', icon: TrendingUp, label: 'Investments' },
  { name: 'gift', icon: Gift, label: 'Gifts' },
  { name: 'music', icon: Music, label: 'Music' },
  { name: 'camera', icon: Camera, label: 'Photography' },
  { name: 'laptop', icon: Laptop, label: 'Technology' },
  { name: 'dumbbell', icon: Dumbbell, label: 'Fitness' },
  { name: 'paint-bucket', icon: PaintBucket, label: 'Art & Crafts' },
  { name: 'wrench', icon: Wrench, label: 'Maintenance' },
  { name: 'briefcase', icon: Briefcase, label: 'Business' },
  { name: 'credit-card', icon: CreditCard, label: 'Credit Card' },
  { name: 'wifi', icon: Wifi, label: 'Internet' },
  { name: 'pizza', icon: Pizza, label: 'Fast Food' },
  { name: 'headphones', icon: Headphones, label: 'Audio' },
  { name: 'watch', icon: Watch, label: 'Accessories' },
  { name: 'smartphone', icon: Smartphone, label: 'Mobile' },
  { name: 'globe', icon: Globe, label: 'Online Services' }
];

export default function IconPicker({ value, onChange, className = '' }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedIcon = AVAILABLE_ICONS.find(icon => icon.name === value);
  const SelectedIconComponent = selectedIcon?.icon || MoreHorizontal;

  const filteredIcons = AVAILABLE_ICONS.filter(icon =>
    icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Icon
      </label>
      
      {/* Icon Display Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <SelectedIconComponent className="w-5 h-5 text-gray-600" />
        <span className="text-sm text-gray-700">
          {selectedIcon?.label || 'Select an icon'}
        </span>
        <svg
          className="ml-auto h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Icon Picker Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute z-20 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg">
            {/* Search Bar */}
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>

            {/* Icons Grid */}
            <div className="p-3 max-h-64 overflow-y-auto">
              {filteredIcons.length > 0 ? (
                <div className="grid grid-cols-6 gap-2">
                  {filteredIcons.map((iconData) => {
                    const IconComponent = iconData.icon;
                    return (
                      <button
                        key={iconData.name}
                        type="button"
                        onClick={() => handleIconSelect(iconData.name)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                          value === iconData.name ? 'bg-blue-50 border-2 border-blue-500' : 'border border-transparent'
                        }`}
                        title={iconData.label}
                      >
                        <IconComponent className="w-5 h-5 text-gray-600 mb-1" />
                        <span className="text-xs text-gray-500 text-center leading-tight">
                          {iconData.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MoreHorizontal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No icons found</p>
                  <p className="text-xs">Try a different search term</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 rounded-b-md">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Export the icon mapping for use in other components
export { AVAILABLE_ICONS };