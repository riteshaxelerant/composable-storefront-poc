import React from 'react';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { ArticleDetail } from '@/components/strapi/ArticleDetail';
import { StrapiPage } from '@/components/strapi/StrapiPage';
import { getMiddleware } from '@/lib/middleware';

interface SlugPageProps {
  params: {
    slug: string[];
  };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const slug = params.slug.join('/');
  const middleware = getMiddleware();
  const resolvedContent = await middleware.resolve(slug);
  
  if (!resolvedContent) {
    return (
      <DefaultLayout title="Page Not Found">
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary-900 mb-4">404</h1>
            <p className="text-secondary-600">Page not found</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  const { type: contentType, source, data: content, metadata } = resolvedContent;

  // If no content was resolved, show 404
  if (!content) {
    return (
      <DefaultLayout title="Page Not Found">
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary-900 mb-4">404</h1>
            <p className="text-secondary-600">Page not found</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  // Render appropriate component based on content type and source
  if (source === 'strapi' && contentType === 'article') {
    return (
      <DefaultLayout 
        title={metadata?.title || content.title} 
        description={metadata?.description || content.description}
        source="strapi"
      >
        <div className="min-h-screen bg-secondary-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ArticleDetail slug={slug} />
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (source === 'strapi' && contentType === 'page') {
    return (
      <DefaultLayout 
        title={metadata?.title || content.title} 
        description={metadata?.description || content.seo?.metaDescription}
        source="strapi"
      >
        <div className="min-h-screen bg-secondary-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StrapiPage slug={slug} />
          </div>
        </div>
      </DefaultLayout>
    );
  }

  // For other content types, show basic content
  return (
    <DefaultLayout 
      title={metadata?.title || content.title || content.name || 'Content'} 
      description={metadata?.description}
      source={(source === 'magento' || source === 'strapi') ? source : undefined}
    >
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              {content.title || content.name}
            </h1>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-secondary-600">
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
                  {source === 'magento' ? 'Magento' : 'Strapi'} {contentType}
                </span>
                {content.identifier && (
                  <span>ID: {content.identifier}</span>
                )}
              </div>
              
              {content.content && (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              )}
              
              {content.description && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-secondary-600">{content.description}</p>
                </div>
              )}
              
              {content.short_description && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-secondary-600">{content.short_description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
