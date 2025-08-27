'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface QuestionOption {
  id: string;
  title: string;
  description: string;
  price: number | null;
  hasQuantity: boolean;
  qImage?: {
    url: string;
    name: string;
    alternativeText?: string;
  };
}

interface StorageSelectionProps {
  question: {
    title: string;
    toolTip?: string;
    description: string;
    questionType: string;
    questionOptions: QuestionOption[];
  };
  onSelectionChange: (selection: any) => void;
}

export function StorageSelection({ question, onSelectionChange }: StorageSelectionProps) {
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [initialized, setInitialized] = useState(false);

  // Memoized update selection function
  const updateSelection = useCallback((storageId: string, quantity: number) => {
    if (!storageId) return;

    const storage = question.questionOptions.find(opt => opt.id === storageId);
    if (!storage) return;

    const unitPrice = storage.price || 0;
    const totalPrice = unitPrice * quantity;

    onSelectionChange({
      storageId,
      selectedQuantity: quantity,
      unitPrice,
      totalPrice,
      storageTitle: storage.title,
    });
  }, [question.questionOptions, onSelectionChange]);

  // Initialize default selections only once
  useEffect(() => {
    if (!initialized && question.questionOptions && question.questionOptions.length > 0) {
      const firstStorage = question.questionOptions[0];
      
      // Set default storage
      setSelectedStorage(firstStorage.id);

      // Set default quantity for each storage (minimum 1)
      const defaultQuantities: Record<string, number> = {};
      question.questionOptions.forEach(storage => {
        defaultQuantities[storage.id] = 1; // Default quantity is 1
      });

      setQuantities(defaultQuantities);
      setInitialized(true);

      // Trigger initial selection
      updateSelection(firstStorage.id, 1);
    }
  }, [question.questionOptions, initialized, updateSelection]);

  const handleStorageSelect = (storageId: string) => {
    setSelectedStorage(storageId);
    updateSelection(storageId, quantities[storageId] || 1);
  };

  const handleQuantityChange = (storageId: string, newQuantity: number) => {
    // Ensure quantity is at least 1
    const validQuantity = Math.max(1, newQuantity);
    
    setQuantities(prev => ({
      ...prev,
      [storageId]: validQuantity
    }));
    
    if (storageId === selectedStorage) {
      updateSelection(storageId, validQuantity);
    }
  };

  const incrementQuantity = (storageId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection
    const currentQuantity = quantities[storageId] || 1;
    handleQuantityChange(storageId, currentQuantity + 1);
  };

  const decrementQuantity = (storageId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection
    const currentQuantity = quantities[storageId] || 1;
    if (currentQuantity > 1) {
      handleQuantityChange(storageId, currentQuantity - 1);
    }
  };

  const getImageUrl = (storage: QuestionOption) => {
    // Use main image only
    if (storage.qImage?.url) {
      return `${process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL?.replace('/graphql', '')}${storage.qImage.url}`;
    }
    
    // Placeholder image
    return 'https://picsum.photos/400/300';
  };

  const getSelectedStorage = () => question.questionOptions.find(opt => opt.id === selectedStorage);

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

      {/* Storage Selection - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {question.questionOptions.map((storage) => {
          const quantity = quantities[storage.id] || 1;
          const unitPrice = storage.price || 0;
          const totalPrice = unitPrice * quantity;

          return (
            <Card 
              key={storage.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedStorage === storage.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleStorageSelect(storage.id)}
            >
              {/* Storage Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={getImageUrl(storage)}
                  alt={storage.qImage?.alternativeText || storage.title}
                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://picsum.photos/400/300';
                  }}
                />
                {selectedStorage === storage.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {storage.title}
                </h3>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Description */}
                <p className="text-sm text-secondary-600 mb-4 line-clamp-3">
                  {storage.description}
                </p>

                {/* Quantity Selector */}
                {storage.hasQuantity && (
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-secondary-700 mb-2">
                      Quantity:
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => decrementQuantity(storage.id, e)}
                        disabled={quantity <= 1}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                          quantity <= 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                      >
                        −
                      </button>
                      
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          e.stopPropagation();
                          const newQuantity = parseInt(e.target.value) || 1;
                          handleQuantityChange(storage.id, newQuantity);
                        }}
                        min="1"
                        className="w-16 text-center border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      
                      <button
                        type="button"
                        onClick={(e) => incrementQuantity(storage.id, e)}
                        className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold hover:bg-green-600 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Price Display */}
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-xs text-secondary-500 mb-1">
                      £{unitPrice.toLocaleString()} × {quantity}
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      £{totalPrice.toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Radio Button Visual Indicator */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedStorage === storage.id 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedStorage === storage.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


    </div>
  );
}
