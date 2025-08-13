'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useArticleBySlug } from '@/composables/strapi/useArticleBySlug';
import type { StrapiArticle } from '@/types/strapi';

interface ArticleDetailProps {
  slug: string;
}

function ArticleContent({ article }: { article: StrapiArticle }) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString();
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        {article.cover && (
          <div className="aspect-video relative bg-secondary-200 rounded-t-lg overflow-hidden">
            <Image
              src={`http://localhost:1337${article.cover.url}`}
              alt={article.cover.alternativeText || article.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}
        
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-secondary-600">
              {article.category && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                  {article.category.name}
                </span>
              )}
              <span>{publishedDate}</span>
              {article.author && (
                <span>By {article.author.name}</span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-secondary-900">
              {article.title}
            </h1>
            
            <p className="text-lg text-secondary-600">
              {article.description}
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose prose-lg max-w-none">
            {/* Note: In a real implementation, you would fetch the full content */}
            <p className="text-secondary-700">
              This is a sample article from Strapi. In a real implementation, 
              you would fetch the complete article content including rich text, 
              embedded media, and other dynamic zones.
            </p>
            
            <h2>Article Content</h2>
            <p>
              The article content would be rendered here using Strapi's rich text 
              or blocks editor. This could include various content types like:
            </p>
            
            <ul>
              <li>Rich text content</li>
              <li>Embedded images and media</li>
              <li>Code blocks</li>
              <li>Quotes and callouts</li>
              <li>Custom components</li>
            </ul>
            
            <blockquote>
              This is a sample blockquote showing how the article content 
              would be styled and displayed.
            </blockquote>
          </div>
          
          <div className="mt-8 pt-6 border-t border-secondary-200">
            <div className="flex items-center justify-between text-sm text-secondary-500">
              <span>Powered by Strapi CMS</span>
              <span>Article ID: {article.documentId}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ArticleDetail({ slug }: ArticleDetailProps) {
  const { article, loading, error } = useArticleBySlug(slug);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Error Loading Article
            </h2>
            <p className="text-secondary-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              Article Not Found
            </h2>
            <p className="text-secondary-600">
              The article you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ArticleContent article={article} />;
}