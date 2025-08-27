'use client';

import React, { useState } from 'react';
import { useKitchenEstimator } from '@/composables/strapi/useKitchenEstimator';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { QuestionRenderer } from '../kitchen-estimator/QuestionRenderer';
import { SelectionsSummary } from '../kitchen-estimator/SelectionsSummary';

export function KitchenEstimator() {
  const { kitchenEstimator, loading, error } = useKitchenEstimator();
  const [selections, setSelections] = useState<Record<string, any>>({});

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Kitchen Estimator</h3>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!kitchenEstimator) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Data Available</h3>
        <p className="text-yellow-600">Kitchen estimator data could not be loaded.</p>
      </div>
    );
  }

  const handleSelectionChange = (questionType: string, selections: any) => {
    setSelections(prev => ({
      ...prev,
      [questionType]: selections
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          {kitchenEstimator.title}
        </h1>
        <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
          {kitchenEstimator.description}
        </p>
      </div>

      {/* Questions */}
      {kitchenEstimator.questions?.map((question: any, index: number) => (
        <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
          <QuestionRenderer 
            question={question}
            onSelectionChange={(selections) => handleSelectionChange(question.questionType, selections)}
          />
        </div>
      ))}

      {/* Selections Summary */}
      <SelectionsSummary 
        selections={kitchenEstimator.questions?.map((question: any) => ({
          questionType: question.questionType,
          questionTitle: question.title,
          selection: selections[question.questionType] || null
        })) || []}
      />
    </div>
  );
}
