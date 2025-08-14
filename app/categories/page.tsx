'use client';

import React from 'react';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { CategoryList } from '@/components/magento/CategoryList';

export default function CategoriesPage() {
  return (
    <DefaultLayout 
      title="Product Categories" 
      description="Browse our product categories"
    >
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              Product Categories
            </h1>
            <p className="text-secondary-600">
              Explore our wide range of product categories from Magento
            </p>
          </div>
          <CategoryList />
        </div>
      </div>
    </DefaultLayout>
  );
}
