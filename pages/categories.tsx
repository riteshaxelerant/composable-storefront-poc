import React from 'react';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { CategoryList } from '@/components/magento/CategoryList';

export default function CategoriesPage() {
  return (
    <DefaultLayout 
      title="Categories" 
      description="Browse all product categories"
      source="magento"
    >
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryList />
        </div>
      </div>
    </DefaultLayout>
  );
}