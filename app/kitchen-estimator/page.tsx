import React from 'react';
import type { Metadata } from 'next';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { KitchenEstimator } from '@/components/strapi/KitchenEstimator';

export const metadata: Metadata = {
  title: 'Kitchen Estimator',
  description: 'Get an instant quote for your dream kitchen with our easy-to-use kitchen calculator tool',
};

export default function KitchenEstimatorPage() {
  return (
    <DefaultLayout 
      title="Kitchen Estimator" 
      description="Get an instant quote for your dream kitchen"
    >
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <KitchenEstimator />
        </div>
      </div>
    </DefaultLayout>
  );
}
