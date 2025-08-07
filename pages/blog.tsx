import React from 'react';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { ArticleList } from '@/components/strapi/ArticleList';

export default function BlogPage() {
  return (
    <DefaultLayout 
      title="Blog" 
      description="Latest articles and news"
      source="strapi"
    >
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleList />
        </div>
      </div>
    </DefaultLayout>
  );
}