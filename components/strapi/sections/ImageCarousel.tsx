'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Image {
  url: string;
  caption?: string;
  alternativeText?: string;
}

interface ImageCarouselProps {
  section: {
    id: string;
    __typename: string;
    images: Image[];
  };
}

export function ImageCarousel({ section }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get Strapi base URL for images
  const getStrapiImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL?.replace('/graphql', '') || 'http://localhost:1337';
    return `${strapiBaseUrl}${url}`;
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || section.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === section.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, section.images.length]);

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
    
    // Resume auto-play after 10 seconds of no interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? section.images.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, section.images.length, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === section.images.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, section.images.length, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'Escape') {
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToPrevious, goToNext, isAutoPlaying]);

  if (!section.images || section.images.length === 0) {
    return null;
  }

  const currentImage = section.images[currentIndex];

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-secondary-900">
      {/* Main Image Display */}
      <div className="relative w-full h-full">
        {section.images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={getStrapiImageUrl(image.url)}
              alt={image.alternativeText || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://picsum.photos/1920/1080';
              }}
            />
            
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-20" />
          </div>
        ))}

        {/* Navigation Arrows */}
        {section.images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-secondary-900 transition-all duration-200 shadow-lg hover:shadow-xl group"
              aria-label="Previous image"
            >
              <svg 
                className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-secondary-900 transition-all duration-200 shadow-lg hover:shadow-xl group"
              aria-label="Next image"
            >
              <svg 
                className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              <p className="text-white text-lg md:text-xl leading-relaxed">
                {currentImage.caption}
              </p>
            </div>
          </div>
        )}

        {/* Auto-play Indicator */}
        {section.images.length > 1 && (
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-secondary-900 transition-all duration-200"
              aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isAutoPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Dots Navigation */}
      {section.images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex space-x-3">
            {section.images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {section.images.length > 1 && isAutoPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20">
          <div 
            className="h-full bg-white transition-all duration-300 ease-linear"
            style={{ 
              width: `${((currentIndex + 1) / section.images.length) * 100}%` 
            }}
          />
        </div>
      )}

      {/* Image Counter */}
      {section.images.length > 1 && (
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1 rounded-full bg-black bg-opacity-50 text-white text-sm font-medium">
            {currentIndex + 1} / {section.images.length}
          </div>
        </div>
      )}
    </section>
  );
}
