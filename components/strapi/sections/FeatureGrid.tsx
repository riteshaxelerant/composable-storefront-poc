'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: {
    alternativeText?: string;
    url: string;
  };
}

interface FeatureGridProps {
  section: {
    id: string;
    __typename: string;
    sectionTitle: string;
    features: Feature[];
  };
}

function FeatureItem({ feature }: { feature: Feature }) {
  // Get Strapi base URL for icons
  const getStrapiImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL?.replace('/graphql', '') || 'http://localhost:1337';
    return `${strapiBaseUrl}${url}`;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group hover:border-primary-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Icon */}
          {feature.icon && (
            <div className="flex items-center justify-center w-16 h-16 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors duration-200">
              <img
                src={getStrapiImageUrl(feature.icon.url)}
                alt={feature.icon.alternativeText || feature.title}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback to a default icon SVG if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallbackIcon = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                  if (fallbackIcon) {
                    (fallbackIcon as HTMLElement).style.display = 'block';
                  }
                }}
              />
              <svg 
                className="fallback-icon w-8 h-8 text-primary-600 hidden" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          )}

          {/* Content */}
          <div className="space-y-3">
            <h3 className="font-semibold text-secondary-900 text-lg group-hover:text-primary-700 transition-colors duration-200 line-clamp-2">
              {feature.title}
            </h3>
            <p className="text-sm text-secondary-600 leading-relaxed line-clamp-4">
              {feature.description}
            </p>
          </div>

          {/* Bottom Accent */}
          <div className="pt-4 border-t border-secondary-100 group-hover:border-primary-200 transition-colors duration-200">
            <div className="flex items-center text-primary-600 group-hover:text-primary-700 transition-colors duration-200">
              <span className="text-sm font-medium">Learn More</span>
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FeatureGrid({ section }: FeatureGridProps) {
  if (!section.features || section.features.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            {section.sectionTitle}
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Discover the powerful features that set us apart
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.features.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} />
          ))}
        </div>

        {/* Features Count */}
        <div className="text-center mt-12">
          <p className="text-sm text-secondary-500">
            Showcasing {section.features.length} key feature{section.features.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* CSS for line-clamp */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
