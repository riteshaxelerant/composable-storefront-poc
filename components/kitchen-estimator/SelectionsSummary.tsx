'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface SelectionData {
  questionType: string;
  questionTitle: string;
  selection: any;
}

interface SelectionsSummaryProps {
  selections: SelectionData[];
}

export function SelectionsSummary({ selections }: SelectionsSummaryProps) {
  // Calculate total cost
  const calculateTotal = () => {
    return selections.reduce((total, selection) => {
      if (selection.selection?.totalPrice) {
        return total + selection.selection.totalPrice;
      }
      return total;
    }, 0);
  };

  // Format selection details based on question type
  const formatSelectionDetails = (selection: SelectionData) => {
    const { questionType, selection: data } = selection;

    switch (questionType) {
      case 'range':
        return {
          title: data.rangeTitle || 'Kitchen Range',
          details: [
            data.handleOption && `Handle: ${data.handleOption}`,
            data.colorVariant && `Color: ${data.colorVariant}`,
          ].filter(Boolean).join(', '),
          price: data.totalPrice || 0
        };

      case 'units':
        return {
          title: data.selectedTitle || 'Kitchen Units',
          details: data.selectedUnits ? `${data.selectedUnits} units` : '',
          price: data.selectedPrice || 0
        };

      case 'worktop_style':
        return {
          title: data.selectedTitle || 'Worktop Style',
          details: data.selectedUnits ? `${data.selectedUnits} units` : '',
          price: data.selectedPrice || 0
        };

      case 'sink_type':
        return {
          title: data.sinkTitle || 'Sink Type',
          details: data.selectedOption ? `Configuration: ${data.selectedOption}` : '',
          price: data.totalPrice || 0
        };

      case 'storage_type':
        return {
          title: data.storageTitle || 'Storage',
          details: `Quantity: ${data.selectedQuantity || 1}`,
          price: data.totalPrice || 0
        };

      default:
        return {
          title: 'Unknown Selection',
          details: '',
          price: 0
        };
    }
  };

  // Get question type display name
  const getQuestionTypeDisplayName = (questionType: string) => {
    const typeMap: Record<string, string> = {
      'range': 'Kitchen Range',
      'units': 'Kitchen Units',
      'worktop_style': 'Worktop Style',
      'sink_type': 'Sink Type',
      'storage_type': 'Storage'
    };
    return typeMap[questionType] || questionType;
  };

  const totalCost = calculateTotal();
  const hasSelections = selections.length > 0 && selections.some(s => s.selection);

  if (!hasSelections) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <h3 className="text-xl font-semibold text-secondary-900">
            Your Selections Summary
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-600 text-center py-8">
            Make selections above to see your kitchen estimate
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 border-2 border-blue-200 bg-blue-50">
      <CardHeader className="bg-blue-100 border-b border-blue-200">
        <h3 className="text-xl font-semibold text-blue-900 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Your Selections Summary
        </h3>
        <p className="text-sm text-blue-700 mt-1">
          Review your kitchen selections and estimated cost
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-blue-100">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-blue-900 border-b border-blue-200">
                  Category
                </th>
                <th className="text-left py-4 px-6 font-semibold text-blue-900 border-b border-blue-200">
                  Selection
                </th>
                <th className="text-right py-4 px-6 font-semibold text-blue-900 border-b border-blue-200">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {selections.map((selection, index) => {
                if (!selection.selection) return null;
                
                const formatted = formatSelectionDetails(selection);
                return (
                  <tr key={index} className="border-b border-blue-100 hover:bg-blue-50">
                    <td className="py-4 px-6 font-medium text-secondary-900">
                      {getQuestionTypeDisplayName(selection.questionType)}
                    </td>
                    <td className="py-4 px-6 text-secondary-700">
                      <div>
                        <div className="font-medium">{formatted.title}</div>
                        {formatted.details && (
                          <div className="text-sm text-secondary-500 mt-1">
                            {formatted.details}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-green-600">
                      £{formatted.price.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              
              {/* Total Row */}
              <tr className="bg-blue-100 border-t-2 border-blue-300">
                <td className="py-4 px-6 font-bold text-blue-900" colSpan={2}>
                  TOTAL ESTIMATED COST
                </td>
                <td className="py-4 px-6 text-right font-bold text-2xl text-green-700">
                  £{totalCost.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden bg-white">
          {selections.map((selection, index) => {
            if (!selection.selection) return null;
            
            const formatted = formatSelectionDetails(selection);
            return (
              <div key={index} className="p-4 border-b border-blue-100 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-secondary-900 mb-1">
                      {getQuestionTypeDisplayName(selection.questionType)}
                    </h4>
                    <p className="font-medium text-secondary-700 mb-1">
                      {formatted.title}
                    </p>
                    {formatted.details && (
                      <p className="text-sm text-secondary-500">
                        {formatted.details}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-green-600">
                      £{formatted.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Mobile Total */}
          <div className="p-4 bg-blue-100 border-t-2 border-blue-300">
            <div className="flex justify-between items-center">
              <span className="font-bold text-blue-900">
                TOTAL ESTIMATED COST
              </span>
              <span className="font-bold text-2xl text-green-700">
                £{totalCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Additional Information */}
      <div className="bg-blue-50 px-6 py-4 border-t border-blue-200">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-blue-800 font-medium">
              This is an estimated cost based on your selections.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Final pricing may vary based on installation requirements, measurements, and additional services.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
