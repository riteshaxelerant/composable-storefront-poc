'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useStrapiPage } from '@/composables/strapi/useStrapiPage';

interface StrapiPageProps {
  slug: string;
}

export function StrapiPage({ slug }: StrapiPageProps) {
  const { page, loading, error } = useStrapiPage({ slug });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Error Loading Page
          </h3>
          <p className="text-secondary-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!page) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Page Not Found
          </h3>
          <p className="text-secondary-600">
            The page "{slug}" could not be found in Strapi.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          Strapi Page: {page.title}
        </h2>
        <p className="text-secondary-600">
          Slug: {page.slug} | Document ID: {page.documentId}
        </p>
      </div>
      
      {/* SEO Information */}
      {page.seo && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              SEO Information
            </h3>
            <div className="space-y-2">
              <p><strong>Meta Title:</strong> {page.seo.metaTitle}</p>
              <p><strong>Meta Description:</strong> {page.seo.metaDescription}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Content Sections */}
      {page.contentSections && page.contentSections.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Content Sections ({page.contentSections.length})
            </h3>
            <div className="space-y-4">
              {page.contentSections.map((section: any, index: number) => (
                <div key={section.id || index} className="border border-secondary-200 rounded p-4">
                  <h4 className="font-medium text-secondary-900 mb-2">
                    {section.__typename} (ID: {section.id})
                  </h4>
                  <pre className="text-xs text-secondary-600 bg-secondary-50 p-3 rounded overflow-auto">
                    {JSON.stringify(section, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Complete JSON Result */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Complete JSON Result
          </h3>
          <pre className="text-xs text-secondary-600 bg-secondary-50 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(page, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
} 