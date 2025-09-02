'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useStrapiPage } from '@/composables/strapi/useStrapiPage';
import { SectionRenderer } from './SectionRenderer';

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
    <>
      {/* Render Content Sections */}
      {page.contentSections && page.contentSections.length > 0 ? (
        <div className="w-full">
          {page.contentSections.map((section: any, index: number) => (
            <SectionRenderer 
              key={section.id || index} 
              section={section} 
            />
          ))}
        </div>
      ) : (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                No Content Sections
              </h3>
              <p className="text-secondary-600">
                This page doesn't have any content sections to display.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
} 