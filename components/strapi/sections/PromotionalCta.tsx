'use client';

import React from 'react';
import Link from 'next/link';

interface PromotionalCtaProps {
  section: {
    id: string;
    __typename: string;
    title: string;
    body: string;
    buttonText: string;
    buttonUrl: string;
  };
}

export function PromotionalCta({ section }: PromotionalCtaProps) {
  if (!section.title && !section.body) {
    return null;
  }

  const isExternalLink = section.buttonUrl?.startsWith('http');

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-white rounded-full translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Title */}
          {section.title && (
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {section.title}
            </h2>
          )}

          {/* Body Text */}
          {section.body && (
            <p className="text-xl md:text-2xl text-primary-100 mb-10 max-w-4xl mx-auto leading-relaxed">
              {section.body}
            </p>
          )}

          {/* CTA Button */}
          {section.buttonText && section.buttonUrl && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isExternalLink ? (
                <a
                  href={section.buttonUrl}
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-700 bg-white rounded-full hover:bg-primary-50 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl min-w-[200px]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{section.buttonText}</span>
                  <svg 
                    className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <Link
                  href={section.buttonUrl}
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-700 bg-white rounded-full hover:bg-primary-50 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl min-w-[200px]"
                >
                  <span>{section.buttonText}</span>
                  <svg 
                    className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
