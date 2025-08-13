'use client';

import React from 'react';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { ProductList } from '@/components/magento/ProductList';

export default function ProductsPage() {
  return (
    <DefaultLayout 
      title="Products" 
      description="Browse our product catalog"
    >
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              Products
            </h1>
            <p className="text-secondary-600">
              Explore our product catalog from Magento
            </p>
          </div>
          <ProductList categoryUid="Mw==" />
        </div>
      </div>
    </DefaultLayout>
  );
}
