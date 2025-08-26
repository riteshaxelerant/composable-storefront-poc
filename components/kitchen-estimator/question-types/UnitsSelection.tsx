'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface QuestionOption {
  id: string;
  title: string;
  description: string;
  price: number | null;
  units: number | null;
  qImage?: {
    url: string;
    name: string;
    alternativeText?: string;
  };
}

interface UnitsSelectionProps {
  question: {
    title: string;
    toolTip?: string;
    description: string;
    questionType: string;
    questionOptions: QuestionOption[];
  };
  onSelectionChange: (selection: any) => void;
}

export function UnitsSelection({ question, onSelectionChange }: UnitsSelectionProps) {
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [initialized, setInitialized] = useState(false);

  // Memoized update selection function
  const updateSelection = useCallback((unitId: string) => {
    if (!unitId) return;

    const unit = question.questionOptions.find(opt => opt.id === unitId);
    if (!unit) return;

    onSelectionChange({
      selectedUnitId: unitId,
      selectedPrice: unit.price || 0,
      selectedTitle: unit.title,
      selectedUnits: unit.units,
    });
  }, [question.questionOptions, onSelectionChange]);

  // Initialize default selection only once
  useEffect(() => {
    if (!initialized && question.questionOptions && question.questionOptions.length > 0) {
      const firstUnit = question.questionOptions[0];
      setSelectedUnit(firstUnit.id);
      setInitialized(true);

      // Trigger initial selection
      updateSelection(firstUnit.id);
    }
  }, [question.questionOptions, initialized, updateSelection]);

  const handleUnitSelect = (unitId: string) => {
    setSelectedUnit(unitId);
    updateSelection(unitId);
  };

  const getImageUrl = (unit: QuestionOption) => {
    // Use main image
    if (unit.qImage?.url) {
      return `${process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL?.replace('/graphql', '')}${unit.qImage.url}`;
    }
    
    // Placeholder image
    return 'https://picsum.photos/400/300';
  };

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

      {/* Kitchen Units Selection - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {question.questionOptions.map((unit) => (
          <Card 
            key={unit.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedUnit === unit.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleUnitSelect(unit.id)}
          >
            {/* Unit Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={getImageUrl(unit)}
                alt={unit.qImage?.alternativeText || unit.title}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'https://picsum.photos/400/300';
                }}
              />
              {selectedUnit === unit.id && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {unit.title}
              </h3>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Description */}
              <p className="text-sm text-secondary-600 mb-4 line-clamp-3">
                {unit.description}
              </p>

              {/* Price and Units Display */}
              <div className="flex justify-between items-center">
                <div className="text-right">
                  {unit.price && (
                    <p className="text-xl font-bold text-green-600">
                      £{unit.price.toLocaleString()}
                    </p>
                  )}
                  {unit.units && (
                    <p className="text-sm text-secondary-500">
                      {unit.units} units
                    </p>
                  )}
                </div>
                
                {/* Radio Button Visual Indicator */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedUnit === unit.id 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedUnit === unit.id && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedUnit && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Current Selection:</h4>
          {(() => {
            const selected = question.questionOptions.find(opt => opt.id === selectedUnit);
            return selected ? (
              <div className="text-blue-800">
                <p><strong>{selected.title}</strong></p>
                {selected.price && (
                  <p>Price: £{selected.price.toLocaleString()}</p>
                )}
                {selected.units && (
                  <p>Units: {selected.units}</p>
                )}
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}
