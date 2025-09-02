'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';

interface Slide {
  name: string;
  link: string;
  image: {
    caption?: string;
    alternativeText?: string;
    url: string;
  };
}

interface ProductSliderProps {
  section: {
    id: string;
    __typename: string;
    title: string;
    slides: Slide[];
  };
}

export function ProductSlider({ section }: ProductSliderProps) {
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

  // Create extended slides array for infinite scrolling
  const extendedSlides = section.slides.length > 0 ? [
    ...section.slides.slice(-2), // Last 2 slides at the beginning
    ...section.slides,            // Original slides
    ...section.slides.slice(0, 2) // First 2 slides at the end
  ] : [];

  const slideWidth = 320; // Width of each slide including margin

  useEffect(() => {
    if (sliderRef.current && extendedSlides.length > 0) {
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
        const realEndIndex = section.slides.length + index;
        sliderRef.current.scrollLeft = realEndIndex * slideWidth;
        setCurrentIndex(realEndIndex);
      }
      // If we're at the fake end (showing first slides), jump to real beginning
      else if (index >= section.slides.length + 2) {
        const realStartIndex = index - section.slides.length;
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

  if (!section.slides || section.slides.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              {section.title}
            </h2>
            <p className="text-secondary-600">
              Explore our featured products
            </p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="hidden md:flex space-x-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full bg-secondary-100 hover:bg-secondary-200 text-secondary-600 hover:text-secondary-900 transition-colors"
              aria-label="Previous products"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full bg-secondary-100 hover:bg-secondary-200 text-secondary-600 hover:text-secondary-900 transition-colors"
              aria-label="Next products"
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
            {extendedSlides.map((slide, index) => (
              <div key={index} className="flex-none w-80">
                <Link 
                  href={slide.link}
                  className="block group"
                >
                  <Card className="overflow-hidden bg-white border border-secondary-200 hover:border-primary-300 transition-all duration-200 hover:shadow-lg">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getStrapiImageUrl(slide.image.url)}
                        alt={slide.image.alternativeText || slide.name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = 'https://picsum.photos/400/300';
                        }}
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />
                      
                      {/* View Product Badge */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          View Product
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {slide.name}
                        </h3>
                        
                        {slide.image.caption && (
                          <p className="text-sm text-secondary-600 line-clamp-2">
                            {slide.image.caption}
                          </p>
                        )}
                        
                        {/* Call to Action */}
                        <div className="flex items-center text-primary-600 group-hover:text-primary-700 transition-colors">
                          <span className="text-sm font-medium">Learn More</span>
                          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Mobile Navigation Dots */}
          <div className="flex md:hidden justify-center mt-6 space-x-2">
            {section.slides.map((_, index) => {
              // Calculate if this dot should be active
              const isActive = (() => {
                const adjustedIndex = currentIndex >= 2 ? 
                  (currentIndex - 2) % section.slides.length : 
                  currentIndex;
                return adjustedIndex === index;
              })();

              return (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index + 2)} // Add 2 to account for prepended slides
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
