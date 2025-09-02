'use client';

import React from 'react';
import Link from 'next/link';

interface HeroBannerProps {
  section: {
    id: string;
    __typename: string;
    herotitle: string;
    subtitle: string;
    buttonText?: string;
    buttonUrl?: string;
    backgroundImage?: {
      alternativeText?: string;
      caption?: string;
      url: string;
    };
  };
}

export function HeroBanner({ section }: HeroBannerProps) {
  // Get Strapi base URL for images
  const getStrapiImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL?.replace('/graphql', '') || 'http://localhost:1337';
    return `${strapiBaseUrl}${url}`;
  };

  const backgroundImageUrl = section.backgroundImage?.url 
    ? getStrapiImageUrl(section.backgroundImage.url)
    : '';

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      {backgroundImageUrl && (
        <div className="absolute inset-0">
          <img
            src={backgroundImageUrl}
            alt={section.backgroundImage?.alternativeText || section.herotitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://picsum.photos/1920/800';
            }}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Title */}
            {section.herotitle && (
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
              >
                {section.herotitle}
              </h1>
            )}
            
            
            {/* Subtitle */}
            {section.subtitle && (
              <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                {section.subtitle}
              </p>
            )}
            
            {/* Call to Action Button */}
            {section.buttonText && section.buttonUrl && (
              <div className="mb-8">
                {section.buttonUrl.startsWith('http') ? (
                  <a
                    href={section.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                  >
                    {section.buttonText}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <Link 
                    href={section.buttonUrl}
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                  >
                    {section.buttonText}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom gradient for better visual separation */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </section>
  );
}
