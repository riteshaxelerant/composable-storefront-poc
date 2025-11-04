'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/utils/cn';

/**
 * Slide data interface
 */
export interface SlideData {
  id: string | number;
  content: React.ReactNode;
  image?: string;
  alt?: string;
}

/**
 * Carousel component props
 * 
 * @example
 * ```tsx
 * <Carousel
 *   slides={[
 *     { id: 1, content: <div>Slide 1</div>, image: '/image1.jpg' },
 *     { id: 2, content: <div>Slide 2</div>, image: '/image2.jpg' }
 *   ]}
 *   autoPlay={true}
 *   duration={1.2}
 *   blurAmount={2}
 * />
 * ```
 */
interface CarouselProps {
  /** Array of slide data objects */
  slides: SlideData[];
  /** Enable automatic slide progression */
  autoPlay?: boolean;
  /** Interval between auto-play transitions in milliseconds */
  autoPlayInterval?: number;
  /** Show navigation arrows */
  showNavigation?: boolean;
  /** Show dot indicators */
  showDots?: boolean;
  /** Additional className for the carousel container */
  className?: string;
  /** Additional className for individual slides */
  slideClassName?: string;
  /** Animation duration in seconds (default: 1.2) */
  duration?: number;
  /** GSAP easing string (default: 'power2.out') */
  easing?: string;
  /** Blur amount in pixels for previous/inactive slides (default: 2) */
  blurAmount?: number;
}

export function Carousel({
  slides,
  autoPlay = false,
  autoPlayInterval = 5000,
  showNavigation = true,
  showDots = true,
  className,
  slideClassName,
  duration = 1.2,
  easing = 'power2.out',
  blurAmount = 2,
}: CarouselProps) {
  // Create infinite loop by duplicating slides
  const infiniteSlides = useMemo<Array<SlideData & { originalIndex?: number }>>(() => {
    if (slides.length === 0) return [];
    // Add copies at the beginning and end for seamless looping
    return [
      ...slides.map((s, i) => ({ ...s, id: `clone-end-${s.id}`, originalIndex: i })),
      ...slides.map((s, i) => ({ ...s, id: s.id, originalIndex: i })),
      ...slides.map((s, i) => ({ ...s, id: `clone-start-${s.id}`, originalIndex: i })),
    ];
  }, [slides]);

  const [currentIndex, setCurrentIndex] = useState(slides.length); // Start at first real slide
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string | number>>(new Set());
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const imageWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Add slide to refs array
  const addToRefs = useCallback((el: HTMLDivElement | null, index: number) => {
    if (el) {
      slidesRef.current[index] = el;
    }
  }, []);

  // Calculate slide width (40% of container to show 2.5 slides)
  const getSlideWidth = useCallback(() => {
    if (!carouselContainerRef.current) return 0;
    return carouselContainerRef.current.offsetWidth * 0.4;
  }, []);

  // Calculate gap between slides
  const getGap = useCallback(() => {
    if (!carouselContainerRef.current) return 0;
    return carouselContainerRef.current.offsetWidth * 0.02; // 2% gap
  }, []);

  // Calculate translateX to center the active slide
  const getTranslateX = useCallback((index: number) => {
    const slideWidth = getSlideWidth();
    const gap = getGap();
    const containerWidth = carouselContainerRef.current?.offsetWidth || 0;
    // Center the active slide: container width / 2 - slide width / 2 - (index * (slideWidth + gap))
    const totalOffset = index * (slideWidth + gap);
    return containerWidth / 2 - slideWidth / 2 - totalOffset;
  }, [getSlideWidth, getGap]);

  // Update carousel wrapper width
  const updateCarouselWidth = useCallback(() => {
    if (!carouselWrapperRef.current || !carouselContainerRef.current) return;
    const containerWidth = carouselContainerRef.current.offsetWidth;
    const slideWidth = containerWidth * 0.4;
    const gap = containerWidth * 0.02;
    const totalWidth = infiniteSlides.length * (slideWidth + gap) - gap; // Subtract last gap
    gsap.set(carouselWrapperRef.current, {
      width: totalWidth,
    });
  }, [infiniteSlides.length]);

  // Load image when slide becomes active or nearby
  const loadImage = useCallback((index: number) => {
    const slide = infiniteSlides[index];
    if (!slide?.image) return;
    
    // Use original slide ID for tracking
    const slideId = slide.originalIndex !== undefined ? slides[slide.originalIndex].id : slide.id;
    if (loadedImages.has(slideId)) return;

    setLoadedImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(slideId);
      return newSet;
    });
  }, [infiniteSlides, slides, loadedImages]);

  // Update slide states with train-coach turbulence effect
  const updateSlideStates = useCallback(
    (activeIndex: number, isNewlyActive = false, direction: 'next' | 'prev' = 'next') => {
      slidesRef.current.forEach((slide, index) => {
        if (!slide) return;

        const distance = Math.abs(index - activeIndex);
        
        // Load images for visible slides (within 2 slides distance)
        if (distance <= 2) {
          loadImage(index);
        }

        // Apply expansion from left to all visible slides (within viewport ~2.5 slides)
        // Visible slides are within distance <= 2
        const isVisible = distance <= 2;
        
        if (isVisible && isNewlyActive) {
          // Rubber band effect: one end stays fixed, other end expands/contracts
          // Next (carousel moves left) = pull from RIGHT edge (left edge stays fixed)
          // Previous (carousel moves right) = pull from LEFT edge (right edge stays fixed)
          const isNext = direction === 'next';
          const staggerDelay = distance * 0.06;
          
          // Get the image wrapper for this slide
          const imageWrapper = imageWrapperRefs.current[index];
          if (!imageWrapper) return;
          
          // Get the current width to calculate proper scaling
          const currentWidth = imageWrapper.offsetWidth;
          
          // For rubber band effect: fix one edge, expand the other
          // Next: left edge fixed (transformOrigin: 'left center'), expand right
          // Prev: right edge fixed (transformOrigin: 'right center'), expand left
          const transformOrigin = isNext ? 'left center' : 'right center';
          
          // Set transform origin - this pins one edge
          gsap.set(imageWrapper, {
            transformOrigin: transformOrigin,
          });
          
          const tl = gsap.timeline({ delay: duration * 0.1 + staggerDelay });
          
          // Rubber band pull effect (very subtle):
          // 1. Start slightly compressed
          // 2. Expand (one edge fixed, other expands)
          // 3. Contract back to normal
          tl.fromTo(
            imageWrapper,
            {
              scaleX: 0.99, // Very subtle compression
            },
            {
              scaleX: 1.01, // Very subtle expansion from fixed edge
              duration: duration * 0.45,
              ease: 'power2.out',
            }
          ).to(imageWrapper, {
            scaleX: 1,
            duration: duration * 0.4,
            ease: 'power1.out', // Smooth return, no bounce
          });
        } else {
          // Non-visible slides: just set normal state
          const imageWrapper = imageWrapperRefs.current[index];
          if (imageWrapper) {
            gsap.to(imageWrapper, {
              scaleX: 1,
              x: 0,
              duration: duration,
              ease: easing,
            });
          }
        }
      });
    },
    [duration, easing, loadImage]
  );

  // Animate carousel transition
  const animateSlide = useCallback(
    (fromIndex: number, toIndex: number, direction: 'next' | 'prev' = 'next') => {
      if (isAnimating || !carouselWrapperRef.current || slidesRef.current.length === 0) {
        return;
      }
      setIsAnimating(true);

      // Calculate translateX for the new position
      const translateX = getTranslateX(toIndex);

      // Animate the carousel wrapper
      gsap.to(carouselWrapperRef.current, {
        x: translateX,
        duration: duration,
        ease: easing,
        onComplete: () => {
          setIsAnimating(false);
          
          // Handle infinite loop - jump to duplicate slide seamlessly
          if (toIndex >= slides.length * 2) {
            // We're at the end clone, jump to the corresponding real slide
            const newIndex = toIndex - slides.length;
            const jumpX = getTranslateX(newIndex);
            gsap.set(carouselWrapperRef.current, { x: jumpX });
            setCurrentIndex(newIndex);
            updateSlideStates(newIndex, false, direction);
          } else if (toIndex < slides.length) {
            // We're at the beginning clone, jump to the corresponding real slide
            const newIndex = toIndex + slides.length;
            const jumpX = getTranslateX(newIndex);
            gsap.set(carouselWrapperRef.current, { x: jumpX });
            setCurrentIndex(newIndex);
            updateSlideStates(newIndex, false, direction);
          } else {
            setCurrentIndex(toIndex);
            updateSlideStates(toIndex, false, direction);
          }
        },
      });

      // Update slide states during animation with train-coach turbulence effect
      updateSlideStates(toIndex, true, direction);
    },
    [duration, easing, getTranslateX, isAnimating, updateSlideStates, slides.length]
  );

  // Go to specific slide (for dot navigation - uses original slide index)
  const goToSlide = useCallback(
    (originalIndex: number) => {
      if (isAnimating || originalIndex < 0 || originalIndex >= slides.length) {
        return;
      }
      // Convert original index to infinite slide index (middle section)
      const infiniteIndex = originalIndex + slides.length;
      if (infiniteIndex === currentIndex) return;
      // Determine direction for dot navigation
      const dir = infiniteIndex > currentIndex ? 'next' : 'prev';
      animateSlide(currentIndex, infiniteIndex, dir);
    },
    [currentIndex, slides.length, isAnimating, animateSlide]
  );

  // Next slide (infinite)
  const nextSlide = useCallback(() => {
    const nextIndex = currentIndex + 1;
    animateSlide(currentIndex, nextIndex, 'next');
  }, [currentIndex, animateSlide]);

  // Previous slide (infinite)
  const prevSlide = useCallback(() => {
    const prevIndex = currentIndex - 1;
    animateSlide(currentIndex, prevIndex, 'prev');
  }, [currentIndex, animateSlide]);

  // Initialize carousel position and slide states
  useEffect(() => {
    if (!carouselWrapperRef.current || slidesRef.current.length === 0) return;

    // Update carousel width first
    updateCarouselWidth();

    // Set initial position
    const translateX = getTranslateX(currentIndex);
    gsap.set(carouselWrapperRef.current, {
      x: translateX,
    });

    // Initialize slide states
    updateSlideStates(currentIndex, false, 'next');
  }, [currentIndex, getTranslateX, updateSlideStates, updateCarouselWidth]);

  // Initialize slide states on mount and preload adjacent images
  useEffect(() => {
    if (slidesRef.current.length > 0) {
      // Preload current and adjacent images
      const preloadIndices = [
        currentIndex,
        currentIndex - 1,
        currentIndex + 1,
      ];
      
      preloadIndices.forEach((idx) => {
        if (idx >= 0 && idx < infiniteSlides.length) {
          loadImage(idx);
        }
      });

      slidesRef.current.forEach((slide, index) => {
        if (!slide) return;
        const imageWrapper = imageWrapperRefs.current[index];
        // Remove blur, all slides start at normal state
        if (imageWrapper) {
          gsap.set(imageWrapper, {
            opacity: 1,
            scaleX: 1,
            x: 0,
            transformOrigin: 'right center', // Default transform origin
          });
        }
      });
    }
  }, [currentIndex, loadImage, infiniteSlides.length]);

  // Set slide widths after mount
  useEffect(() => {
    // Use a small delay to ensure container is fully rendered
    const timer = setTimeout(() => {
      if (!carouselContainerRef.current || slidesRef.current.length === 0) return;

      const containerWidth = carouselContainerRef.current.offsetWidth;
      const slideWidth = containerWidth * 0.4;
      const gap = containerWidth * 0.02;

      slidesRef.current.forEach((slide, index) => {
        if (!slide) return;
        const isLast = index === infiniteSlides.length - 1;
        gsap.set(slide, {
          width: slideWidth,
          marginRight: isLast ? 0 : gap,
        });
      });

      // Update carousel width
      updateCarouselWidth();
      
      // Set initial position
      const translateX = getTranslateX(currentIndex);
      if (carouselWrapperRef.current) {
        gsap.set(carouselWrapperRef.current, {
          x: translateX,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [infiniteSlides.length, updateCarouselWidth, getTranslateX, currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isAnimating) {
      autoPlayTimerRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);

      return () => {
        if (autoPlayTimerRef.current) {
          clearInterval(autoPlayTimerRef.current);
        }
      };
    }
  }, [autoPlay, autoPlayInterval, nextSlide, isAnimating]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!carouselWrapperRef.current || !carouselContainerRef.current) return;
      
      const containerWidth = carouselContainerRef.current.offsetWidth;
      const slideWidth = containerWidth * 0.4;
      const gap = containerWidth * 0.02;

      // Update slide widths
      slidesRef.current.forEach((slide, index) => {
        if (!slide) return;
        const isLast = index === infiniteSlides.length - 1;
        gsap.set(slide, {
          width: slideWidth,
          marginRight: isLast ? 0 : gap,
        });
      });

      // Update carousel width
      updateCarouselWidth();
      
      // Recalculate and update position on resize
      const translateX = getTranslateX(currentIndex);
      gsap.set(carouselWrapperRef.current, {
        x: translateX,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, getTranslateX, updateCarouselWidth, infiniteSlides.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={cn('relative w-full', className)}>
      {/* Carousel Container */}
      <div
        ref={carouselContainerRef}
        className="relative w-full overflow-hidden"
        style={{ minHeight: '700px' }}
      >
        {/* Carousel Wrapper */}
        <div
          ref={carouselWrapperRef}
          className="flex items-center h-full"
          style={{
            willChange: 'transform',
          }}
        >
          {infiniteSlides.map((slide: SlideData & { originalIndex?: number }, index: number) => {
            // Get original slide index for image loading check
            const originalIndex = slide.originalIndex !== undefined ? slide.originalIndex : index;
            const originalSlide = slides[originalIndex] || slide;
            const slideId = originalSlide.id;
            const isNearby = index === currentIndex || Math.abs(index - currentIndex) <= 1;
            const isLoaded = loadedImages.has(slideId);
            
            return (
            <div
              key={slide.id}
              ref={(el) => addToRefs(el, index)}
              className={cn(
                'flex-shrink-0 flex items-center justify-center',
                slideClassName
              )}
              style={{
                willChange: 'transform, opacity, filter',
                minHeight: '700px',
              }}
            >
              {slide.image ? (
                <div 
                  ref={(el) => {
                    imageWrapperRefs.current[index] = el;
                  }}
                  className="w-full h-full relative  overflow-hidden"
                  style={{
                    willChange: 'transform',
                    transformOrigin: 'right center', // Default, will be updated dynamically
                  }}
                >
                  {(isLoaded || isNearby) ? (
                    <img
                      ref={(el) => {
                        imageRefs.current[index] = el;
                      }}
                      src={slide.image}
                      alt={slide.alt || `Slide ${originalIndex + 1}`}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: '1 / 1' }}
                      loading={isNearby ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary-200 animate-pulse flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-secondary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {slide.content}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full  overflow-hidden">
                  {slide.content}
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      {showNavigation && infiniteSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 z-10',
              'bg-white/80 backdrop-blur-sm hover:bg-white',
              'rounded-full w-12 h-12 flex items-center justify-center',
              'shadow-lg transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500'
            )}
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6 text-secondary-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 z-10',
              'bg-white/80 backdrop-blur-sm hover:bg-white',
              'rounded-full w-12 h-12 flex items-center justify-center',
              'shadow-lg transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500'
            )}
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6 text-secondary-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((slide, originalIndex) => {
            // Calculate if this original slide is currently active
            const isActive = currentIndex >= slides.length && 
                            currentIndex < slides.length * 2 &&
                            (currentIndex - slides.length) === originalIndex;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(originalIndex)}
                disabled={isAnimating}
                className={cn(
                  'rounded-full transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  isActive
                    ? 'w-8 h-2 bg-primary-600'
                    : 'w-2 h-2 bg-white/60 hover:bg-white/80',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                aria-label={`Go to slide ${originalIndex + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

