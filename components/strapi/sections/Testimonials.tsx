'use client';

import React, { useRef, useState, useEffect } from 'react';

interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  authorImage: {
    alternativeText?: string;
    caption?: string;
    url: string;
  };
}

interface TestimonialsProps {
  section: {
    id: string;
    __typename: string;
    sectionTitle: string;
    items: TestimonialItem[];
  };
}

export function Testimonials({ section }: TestimonialsProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get Strapi base URL for images
  const getStrapiImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL?.replace('/graphql', '') || 'http://localhost:1337';
    return `${strapiBaseUrl}${url}`;
  };

  // Create extended items array for infinite scrolling
  const extendedItems = section.items.length > 0 ? [
    ...section.items.slice(-2), // Last 2 items at the beginning
    ...section.items,            // Original items
    ...section.items.slice(0, 2) // First 2 items at the end
  ] : [];

  const slideWidth = 400; // Width of each slide including margin

  useEffect(() => {
    if (sliderRef.current && extendedItems.length > 0) {
      // Initialize position to show the actual first slide (skip the prepended slides)
      const initialOffset = 2 * slideWidth;
      sliderRef.current.scrollLeft = initialOffset;
      setCurrentIndex(2); // Start at index 2 (first real slide)
    }
  }, []);

  const scrollToIndex = (index: number, smooth = true) => {
    if (!sliderRef.current || isTransitioning) return;

    setIsTransitioning(true);
    const targetScrollLeft = index * slideWidth;
    
    if (smooth) {
      sliderRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    } else {
      sliderRef.current.scrollLeft = targetScrollLeft;
    }

    setCurrentIndex(index);

    // Handle infinite loop transitions
    setTimeout(() => {
      if (!sliderRef.current) return;

      // If we're at the fake beginning (showing last slides), jump to real end
      if (index < 2) {
        const realEndIndex = section.items.length + index;
        sliderRef.current.scrollLeft = realEndIndex * slideWidth;
        setCurrentIndex(realEndIndex);
      }
      // If we're at the fake end (showing first slides), jump to real beginning
      else if (index >= section.items.length + 2) {
        const realStartIndex = index - section.items.length;
        sliderRef.current.scrollLeft = realStartIndex * slideWidth;
        setCurrentIndex(realStartIndex);
      }

      setIsTransitioning(false);
    }, smooth ? 300 : 0);
  };

  const scrollLeft = () => {
    const newIndex = currentIndex - 1;
    scrollToIndex(newIndex);
  };

  const scrollRight = () => {
    const newIndex = currentIndex + 1;
    scrollToIndex(newIndex);
  };

  // Handle scroll events to update current index
  const handleScroll = () => {
    if (!sliderRef.current || isTransitioning) return;
    
    const scrollLeft = sliderRef.current.scrollLeft;
    const newIndex = Math.round(scrollLeft / slideWidth);
    setCurrentIndex(newIndex);
  };

  if (!section.items || section.items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              {section.sectionTitle}
            </h2>
            <p className="text-secondary-600">
              What our customers are saying about us
            </p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="hidden md:flex space-x-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full bg-secondary-100 hover:bg-secondary-200 text-secondary-600 hover:text-secondary-900 transition-colors"
              aria-label="Previous testimonials"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full bg-secondary-100 hover:bg-secondary-200 text-secondary-600 hover:text-secondary-900 transition-colors"
              aria-label="Next testimonials"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={handleScroll}
          >
            {extendedItems.map((item, index) => (
              <div key={index} className="flex-none w-96">
                <div className="bg-white rounded-xl shadow-lg p-8 h-full">
                  {/* Quote */}
                  <div className="mb-6">
                    <svg className="w-8 h-8 text-primary-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                    <blockquote className="text-lg text-secondary-700 leading-relaxed">
                      "{item.quote}"
                    </blockquote>
                  </div>

                  {/* Author */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={getStrapiImageUrl(item.authorImage.url)}
                          alt={item.authorImage.alternativeText || item.authorName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.authorName)}&background=e5e7eb&color=6b7280`;
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-900">
                        {item.authorName}
                      </p>
                      <p className="text-sm text-secondary-600">
                        {item.authorTitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Navigation Dots */}
          <div className="flex md:hidden justify-center mt-6 space-x-2">
            {section.items.map((_, index) => {
              // Calculate if this dot should be active
              const isActive = (() => {
                const adjustedIndex = currentIndex >= 2 ? 
                  (currentIndex - 2) % section.items.length : 
                  currentIndex;
                return adjustedIndex === index;
              })();

              return (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index + 2)} // Add 2 to account for prepended items
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isActive ? 'bg-primary-500' : 'bg-secondary-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
