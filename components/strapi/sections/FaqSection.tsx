'use client';

import React, { useState } from 'react';

interface FaqItem {
  id: string;
  title: string;
  summary: string;
  link?: string;
  image?: {
    alternativeText?: string;
    caption?: string;
    url: string;
  };
}

interface FaqSectionProps {
  section: {
    id: string;
    __typename: string;
    sectionTitle: string;
    faqs: FaqItem[];
  };
}

export function FaqSection({ section }: FaqSectionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Get Strapi base URL for images
  const getStrapiImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL?.replace('/graphql', '') || 'http://localhost:1337';
    return `${strapiBaseUrl}${url}`;
  };

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  if (!section.faqs || section.faqs.length === 0) {
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
            Find answers to frequently asked questions
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-6xl mx-auto space-y-4">
          {section.faqs.map((faq, index) => {
            const isOpen = openItems.has(faq.id);
            
            return (
              <div 
                key={faq.id} 
                className="border border-secondary-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-secondary-300"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left bg-white hover:bg-secondary-50 transition-colors duration-200 focus:outline-none focus:bg-secondary-50"
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${faq.id}`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-secondary-900 pr-4">
                      {faq.title}
                    </h3>
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-5 h-5 text-secondary-500 transition-transform duration-200 ${
                          isOpen ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Accordion Content */}
                <div
                  id={`faq-content-${faq.id}`}
                  className={`transition-all duration-200 ease-in-out ${
                    isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-6 pt-2">
                    <div className="border-t border-secondary-100 pt-4">
                      {/* Content with Image and Text */}
                      <div className={`${faq.image ? 'flex flex-col md:flex-row gap-6' : ''}`}>
                        {/* Image Section */}
                        {faq.image && (
                          <div className="md:w-1/3 flex-shrink-0">
                            <div className="relative h-48 md:h-32 rounded-lg overflow-hidden bg-secondary-100">
                              <img
                                src={getStrapiImageUrl(faq.image.url)}
                                alt={faq.image.alternativeText || faq.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=FAQ+Image';
                                }}
                              />
                            </div>
                            {faq.image.caption && (
                              <p className="text-xs text-secondary-500 mt-2 italic">
                                {faq.image.caption}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Text Content */}
                        <div className={`${faq.image ? 'md:w-2/3' : 'w-full'}`}>
                          <div className="prose prose-secondary max-w-none">
                            <p className="text-secondary-700 leading-relaxed whitespace-pre-line">
                              {faq.summary}
                            </p>
                          </div>

                          {/* Link Section */}
                          {faq.link && (
                            <div className="mt-4 pt-4 border-t border-secondary-100">
                              <a
                                href={faq.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200 font-medium"
                              >
                                <span>Learn More</span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Count */}
        <div className="text-center mt-8">
          <p className="text-sm text-secondary-500">
            Showing {section.faqs.length} frequently asked question{section.faqs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </section>
  );
}
