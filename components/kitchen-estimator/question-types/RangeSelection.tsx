'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface ColorVariant {
  colorCode: string;
  colorName: string;
  price: number;
  variationImage?: {
    alternativeText?: string;
    url: string;
    name: string;
  };
}

interface SelectOption {
  label: string;
  price: number;
  value: string;
}

interface QuestionOption {
  id: string;
  title: string;
  description: string;
  price: number | null;
  hasQuantity: boolean;
  units: number | null;
  selectOptions: SelectOption[];
  colorVariants: ColorVariant[];
  qImage?: {
    url: string;
    name: string;
    alternativeText?: string;
  };
}

interface RangeSelectionProps {
  question: {
    title: string;
    toolTip?: string;
    description: string;
    questionType: string;
    questionOptions: QuestionOption[];
  };
  onSelectionChange: (selections: {
    rangeId: string;
    handleOption: string;
    colorVariant: string;
    totalPrice: number;
  }) => void;
}

export function RangeSelection({ question, onSelectionChange }: RangeSelectionProps) {
  const [selectedRange, setSelectedRange] = useState<string>('');
  const [selectedHandles, setSelectedHandles] = useState<Record<string, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);

  // Memoized update selection function
  const updateSelection = useCallback((rangeId: string, handleOption: string, colorVariant: string) => {
    if (!rangeId) return;

    const range = question.questionOptions.find(opt => opt.id === rangeId);
    if (!range) return;

    let totalPrice = 0;
    
    // Add base range price if available
    if (range.price) {
      totalPrice += range.price;
    }

    // Add handle option price
    if (handleOption) {
      const handle = range.selectOptions.find(opt => opt.value === handleOption);
      if (handle) {
        totalPrice += handle.price;
      }
    }

    // Add color variant price
    if (colorVariant) {
      const color = range.colorVariants.find(c => c.colorName === colorVariant);
      if (color) {
        totalPrice += color.price;
      }
    }

    onSelectionChange({
      rangeId,
      handleOption,
      colorVariant,
      totalPrice,
    });
  }, [question.questionOptions, onSelectionChange]);

  // Initialize default selections only once
  useEffect(() => {
    if (!initialized && question.questionOptions && question.questionOptions.length > 0) {
      const firstRange = question.questionOptions[0];
      
      // Set default range
      setSelectedRange(firstRange.id);

      // Set default handle and color for each range
      const defaultHandles: Record<string, string> = {};
      const defaultColors: Record<string, string> = {};

      question.questionOptions.forEach(range => {
        if (range.selectOptions && range.selectOptions.length > 0) {
          defaultHandles[range.id] = range.selectOptions[0].value;
        }
        if (range.colorVariants && range.colorVariants.length > 0) {
          defaultColors[range.id] = range.colorVariants[0].colorName;
        }
      });

      setSelectedHandles(defaultHandles);
      setSelectedColors(defaultColors);
      setInitialized(true);

      // Trigger initial selection
      updateSelection(
        firstRange.id, 
        defaultHandles[firstRange.id] || '', 
        defaultColors[firstRange.id] || ''
      );
    }
  }, [question.questionOptions, initialized, updateSelection]);

  const handleRangeSelect = (rangeId: string) => {
    setSelectedRange(rangeId);
    updateSelection(rangeId, selectedHandles[rangeId] || '', selectedColors[rangeId] || '');
  };

  const handleHandleSelect = (rangeId: string, handleValue: string) => {
    setSelectedHandles(prev => ({
      ...prev,
      [rangeId]: handleValue
    }));
    if (rangeId === selectedRange) {
      updateSelection(rangeId, handleValue, selectedColors[rangeId] || '');
    }
  };

  const handleColorSelect = (rangeId: string, colorName: string) => {
    setSelectedColors(prev => ({
      ...prev,
      [rangeId]: colorName
    }));
    if (rangeId === selectedRange) {
      updateSelection(rangeId, selectedHandles[rangeId] || '', colorName);
    }
  };



  const getImageUrl = (range: QuestionOption) => {
    const selectedColor = selectedColors[range.id];
    if (selectedColor) {
      const colorVariant = range.colorVariants.find(c => c.colorName === selectedColor);
      if (colorVariant?.variationImage?.url) {
        return `${process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL?.replace('/graphql', '')}${colorVariant.variationImage.url}`;
      }
    }
    
    // Fallback to main image
    if (range.qImage?.url) {
      return `${process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL?.replace('/graphql', '')}${range.qImage.url}`;
    }
    
    // Placeholder image
    return 'https://picsum.photos/400/300';
  };

  const getSelectedRange = () => question.questionOptions.find(opt => opt.id === selectedRange);

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-3">
          {question.title}
        </h2>
        {question.toolTip && (
          <p className="text-sm text-secondary-600 mb-2">
            💡 {question.toolTip}
          </p>
        )}
        <p className="text-secondary-600">
          {question.description}
        </p>
      </div>

      {/* Kitchen Range Selection - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {question.questionOptions.map((range) => (
          <Card 
            key={range.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedRange === range.id 
                ? 'ring-2 ring-primary-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleRangeSelect(range.id)}
          >
            {/* Product Image */}
            <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
              <img
                src={getImageUrl(range)}
                alt={range.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Kitchen+Range';
                }}
              />
            </div>

            <CardHeader className="pb-3">
              {/* Product Title */}
              <h4 className="text-lg font-semibold text-secondary-900">
                {range.title}
              </h4>

              {/* Color Selection Icons */}
              {range.colorVariants.length > 0 && (
                <div className="flex gap-2 my-3">
                  {range.colorVariants.map((color) => (
                    <div
                      key={color.colorName}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${
                        selectedColors[range.id] === color.colorName
                          ? 'border-primary-500 shadow-md scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.colorCode }}
                      title={color.colorName}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleColorSelect(range.id, color.colorName);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Product Description */}
              <p className="text-sm text-secondary-600">
                {range.description}
              </p>
            </CardHeader>

            <CardContent>
              {/* Handle Selection Dropdown */}
              {range.selectOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-800">
                    Handle Options:
                  </label>
                  <select
                    value={selectedHandles[range.id] || ''}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleHandleSelect(range.id, e.target.value);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {range.selectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} (£{option.price})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Display */}
              {selectedRange === range.id && (
                <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                  <div className="text-sm text-primary-700">
                    <p><strong>Selected Range:</strong> {range.title}</p>
                    {selectedColors[range.id] && (
                      <p><strong>Color:</strong> {selectedColors[range.id]}</p>
                    )}
                    {selectedHandles[range.id] && (
                      <p><strong>Handle:</strong> {range.selectOptions.find(opt => opt.value === selectedHandles[range.id])?.label}</p>
                    )}
                  </div>
                  <div className="text-lg font-bold text-primary-900 mt-2">
                    Total: £{(() => {
                      let total = range.price || 0;
                      const handle = range.selectOptions.find(opt => opt.value === selectedHandles[range.id]);
                      if (handle) total += handle.price;
                      const color = range.colorVariants.find(c => c.colorName === selectedColors[range.id]);
                      if (color) total += color.price;
                      return total;
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}