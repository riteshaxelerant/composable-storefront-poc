import React from 'react';
import type { Metadata } from 'next';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { ArticleDetail } from '@/components/strapi/ArticleDetail';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  return {
    title: 'Blog Post',
    description: 'Read our latest article',
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;

  return (
    <DefaultLayout 
      title="Blog Post" 
      description="Read our latest article"
    >
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleDetail slug={slug} />
        </div>
      </div>
    </DefaultLayout>
  );
}
