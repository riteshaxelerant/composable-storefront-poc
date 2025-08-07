import React from 'react';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { ProductList } from '@/components/magento/ProductList';

export default function ProductsPage() {
  return (
    <DefaultLayout 
      title="Products" 
      description="Browse all products"
      source="magento"
    >
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductList categoryUid="Mw==" />
        </div>
      </div>
    </DefaultLayout>
  );
} 