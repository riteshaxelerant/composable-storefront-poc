'use client';

import React from 'react';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { ArticleList } from '@/components/strapi/ArticleList';

export default function BlogPage() {
  return (
    <DefaultLayout 
      title="Blog" 
      description="Read our latest articles and insights"
    >
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              Blog
            </h1>
            <p className="text-secondary-600">
              Read our latest articles and insights from Strapi
            </p>
          </div>
          <ArticleList />
        </div>
      </div>
    </DefaultLayout>
  );
}
