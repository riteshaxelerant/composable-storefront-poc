'use client';

import React from 'react';
import { RangeSelection } from './question-types/RangeSelection';
import { UnitsSelection } from './question-types/UnitsSelection';
import { WorktopSelection } from './question-types/WorktopSelection';
import { SinkSelection } from './question-types/SinkSelection';
import { StorageSelection } from './question-types/StorageSelection';

interface QuestionRendererProps {
  question: any;
  onSelectionChange: (selections: any) => void;
}

export function QuestionRenderer({ question, onSelectionChange }: QuestionRendererProps) {
  // Component mapping based on question type
  const componentMap: Record<string, React.ComponentType<any>> = {
    'range': RangeSelection,
    'units': UnitsSelection,
    'worktop_style': WorktopSelection,
    'sink_type': SinkSelection,
    'storage_type': StorageSelection,
  };

  const Component = componentMap[question.questionType];

  if (!Component) {
    // Fallback for unknown question types
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Unsupported Question Type: {question.questionType}
        </h3>
        <p className="text-yellow-600">
          This question type is not yet implemented. Please check back later.
        </p>
        <div className="mt-4 p-4 bg-white rounded border">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
            {JSON.stringify(question, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <Component 
      question={question} 
      onSelectionChange={onSelectionChange}
    />
  );
}
