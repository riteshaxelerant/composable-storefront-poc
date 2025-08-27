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

interface WorktopSelectionProps {
  question: {
    title: string;
    toolTip?: string;
    description: string;
    questionType: string;
    questionOptions: QuestionOption[];
  };
  onSelectionChange: (selection: any) => void;
}

export function WorktopSelection({ question, onSelectionChange }: WorktopSelectionProps) {
  const [selectedWorktop, setSelectedWorktop] = useState<string>('');
  const [initialized, setInitialized] = useState(false);

  // Memoized update selection function
  const updateSelection = useCallback((worktopId: string) => {
    if (!worktopId) return;

    const worktop = question.questionOptions.find(opt => opt.id === worktopId);
    if (!worktop) return;

    onSelectionChange({
      selectedWorktopId: worktopId,
      selectedPrice: worktop.price || 0,
      selectedTitle: worktop.title,
      selectedUnits: worktop.units,
    });
  }, [question.questionOptions, onSelectionChange]);

  // Initialize default selection only once
  useEffect(() => {
    if (!initialized && question.questionOptions && question.questionOptions.length > 0) {
      const firstWorktop = question.questionOptions[0];
      setSelectedWorktop(firstWorktop.id);
      setInitialized(true);

      // Trigger initial selection
      updateSelection(firstWorktop.id);
    }
  }, [question.questionOptions, initialized, updateSelection]);

  const handleWorktopSelect = (worktopId: string) => {
    setSelectedWorktop(worktopId);
    updateSelection(worktopId);
  };

  const getImageUrl = (worktop: QuestionOption) => {
    // Use main image
    if (worktop.qImage?.url) {
      return `${process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL?.replace('/graphql', '')}${worktop.qImage.url}`;
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

      {/* Worktop Style Selection - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {question.questionOptions.map((worktop) => (
          <Card 
            key={worktop.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedWorktop === worktop.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleWorktopSelect(worktop.id)}
          >
            {/* Worktop Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={getImageUrl(worktop)}
                alt={worktop.qImage?.alternativeText || worktop.title}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'https://picsum.photos/400/300';
                }}
              />
              {selectedWorktop === worktop.id && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {worktop.title}
              </h3>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Description */}
              <p className="text-sm text-secondary-600 mb-4 line-clamp-3">
                {worktop.description}
              </p>

              {/* Price and Units Display */}
              <div className="flex justify-between items-center">
                <div className="text-right">
                  {worktop.price && (
                    <p className="text-xl font-bold text-green-600">
                      £{worktop.price.toLocaleString()}
                    </p>
                  )}
                  {worktop.units && (
                    <p className="text-sm text-secondary-500">
                      {worktop.units} units
                    </p>
                  )}
                </div>
                
                {/* Radio Button Visual Indicator */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedWorktop === worktop.id 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedWorktop === worktop.id && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


    </div>
  );
}
