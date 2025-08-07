import React from 'react';
import { GetServerSideProps } from 'next';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { ArticleDetail } from '@/components/strapi/ArticleDetail';
import { StrapiPage } from '@/components/strapi/StrapiPage';
// We'll create a simple inline 404 component since we moved the structure
import { getMiddleware } from '@/lib/middleware';

interface SlugPageProps {
  content: any | null;
  contentType: string | null;
  source: 'magento' | 'strapi' | null;
  slug: string;
  metadata?: {
    title?: string;
    description?: string;
    seo?: any;
  };
}

export default function SlugPage({ content, contentType, source, slug, metadata }: SlugPageProps) {
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
      source={source || undefined}
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
                <p className="text-secondary-600">{content.description}</p>
              )}
              
              <div className="mt-8 pt-6 border-t border-secondary-200">
                <pre className="text-xs text-secondary-500 bg-secondary-50 p-4 rounded overflow-auto">
                  {JSON.stringify(content, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const pathSegments = params?.slug as string[];
  
  if (!pathSegments || pathSegments.length === 0) {
    return {
      notFound: true,
    };
  }

  const slug = pathSegments[pathSegments.length - 1];
  const fullPath = pathSegments.join('/');
  
  // Skip webpack HMR and other system URLs
  if (fullPath.startsWith('__webpack_hmr') || 
      fullPath.startsWith('_next') || 
      fullPath.startsWith('api') ||
      fullPath.includes('.')) {
    return {
      notFound: true,
    };
  }
  
  try {
    console.log(`[SSR] Resolving URL: /${fullPath}`);
    
    // Use middleware to resolve content
    const middleware = getMiddleware();
    const resolvedContent = await middleware.resolve(slug, {
      fullPath,
      userAgent: res?.getHeader('user-agent') as string,
    });
    
    if (resolvedContent) {
      console.log(`[SSR] Found content via ${resolvedContent.source}: ${resolvedContent.type}`);
      
      return {
        props: {
          content: resolvedContent.data,
          contentType: resolvedContent.type,
          source: resolvedContent.source,
          slug,
          metadata: resolvedContent.metadata,
        },
      };
    }

    console.log(`[SSR] No content found for slug: ${slug}`);
    return {
      notFound: true,
    };
  } catch (error) {
    console.error('[SSR] Error resolving URL:', error);
    
    return {
      notFound: true,
    };
  }
};