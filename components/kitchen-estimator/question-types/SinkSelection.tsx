'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

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
  selectOptions: SelectOption[];
  qImage?: {
    url: string;
    name: string;
    alternativeText?: string;
  };
}

interface SinkSelectionProps {
  question: {
    title: string;
    toolTip?: string;
    description: string;
    questionType: string;
    questionOptions: QuestionOption[];
  };
  onSelectionChange: (selection: any) => void;
}

export function SinkSelection({ question, onSelectionChange }: SinkSelectionProps) {
  const [selectedSink, setSelectedSink] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);

  // Memoized update selection function
  const updateSelection = useCallback((sinkId: string, optionValue: string) => {
    if (!sinkId) return;

    const sink = question.questionOptions.find(opt => opt.id === sinkId);
    if (!sink) return;

    let totalPrice = 0;
    
    // Add base sink price if available
    if (sink.price) {
      totalPrice += sink.price;
    }

    // Add selected option price
    if (optionValue) {
      const option = sink.selectOptions.find(opt => opt.value === optionValue);
      if (option) {
        totalPrice += option.price;
      }
    }

    onSelectionChange({
      sinkId,
      selectedOption: optionValue,
      totalPrice,
      sinkTitle: sink.title,
    });
  }, [question.questionOptions, onSelectionChange]);

  // Initialize default selections only once
  useEffect(() => {
    if (!initialized && question.questionOptions && question.questionOptions.length > 0) {
      const firstSink = question.questionOptions[0];
      
      // Set default sink
      setSelectedSink(firstSink.id);

      // Set default option for each sink
      const defaultOptions: Record<string, string> = {};
      question.questionOptions.forEach(sink => {
        if (sink.selectOptions && sink.selectOptions.length > 0) {
          defaultOptions[sink.id] = sink.selectOptions[0].value;
        }
      });

      setSelectedOptions(defaultOptions);
      setInitialized(true);

      // Trigger initial selection
      updateSelection(firstSink.id, defaultOptions[firstSink.id] || '');
    }
  }, [question.questionOptions, initialized, updateSelection]);

  const handleSinkSelect = (sinkId: string) => {
    setSelectedSink(sinkId);
    updateSelection(sinkId, selectedOptions[sinkId] || '');
  };

  const handleOptionSelect = (sinkId: string, optionValue: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [sinkId]: optionValue
    }));
    if (sinkId === selectedSink) {
      updateSelection(sinkId, optionValue);
    }
  };

  const getImageUrl = (sink: QuestionOption) => {
    // Use main image only (no color variants)
    if (sink.qImage?.url) {
      return `${process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL?.replace('/graphql', '')}${sink.qImage.url}`;
    }
    
    // Placeholder image
    return 'https://picsum.photos/400/300';
  };

  const getSelectedSink = () => question.questionOptions.find(opt => opt.id === selectedSink);

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

      {/* Sink Selection - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {question.questionOptions.map((sink) => (
          <Card 
            key={sink.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedSink === sink.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleSinkSelect(sink.id)}
          >
            {/* Sink Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={getImageUrl(sink)}
                alt={sink.qImage?.alternativeText || sink.title}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'https://picsum.photos/400/300';
                }}
              />
              {selectedSink === sink.id && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {sink.title}
              </h3>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Description */}
              <p className="text-sm text-secondary-600 mb-4 line-clamp-3">
                {sink.description}
              </p>

              {/* Select Options Dropdown */}
              {sink.selectOptions && sink.selectOptions.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-medium text-secondary-700 mb-2">
                    Configuration:
                  </label>
                  <select
                    value={selectedOptions[sink.id] || ''}
                    onChange={(e) => handleOptionSelect(sink.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    onClick={(e) => e.stopPropagation()} // Prevent card selection when clicking dropdown
                  >
                    {sink.selectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} {option.price > 0 && `(+£${option.price})`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Display */}
              <div className="flex justify-between items-center">
                <div className="text-right">
                  {(() => {
                    let totalPrice = sink.price || 0;
                    const selectedOption = sink.selectOptions?.find(opt => opt.value === selectedOptions[sink.id]);
                    if (selectedOption) {
                      totalPrice += selectedOption.price;
                    }
                    return (
                      <p className="text-xl font-bold text-green-600">
                        £{totalPrice.toLocaleString()}
                      </p>
                    );
                  })()}
                  <p className="text-xs text-secondary-500">
                    Base: £{(sink.price || 0).toLocaleString()}
                  </p>
                </div>
                
                {/* Radio Button Visual Indicator */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedSink === sink.id 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedSink === sink.id && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedSink && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Current Selection:</h4>
          {(() => {
            const selected = getSelectedSink();
            const selectedOption = selected?.selectOptions?.find(opt => opt.value === selectedOptions[selectedSink]);
            if (!selected) return null;

            let totalPrice = selected.price || 0;
            if (selectedOption) {
              totalPrice += selectedOption.price;
            }

            return (
              <div className="text-blue-800">
                <p><strong>{selected.title}</strong></p>
                {selectedOption && (
                  <p>Configuration: {selectedOption.label}</p>
                )}
                <p>Total Price: £{totalPrice.toLocaleString()}</p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
