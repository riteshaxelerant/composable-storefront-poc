'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/utils/cn';

export interface HeroSlideData {
  id: string | number;
  image: string;
  alt?: string;
  content?: React.ReactNode;
}

interface HeroSliderProps {
  slides: HeroSlideData[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showDots?: boolean;
  className?: string;
  duration?: number;
  easing?: string;
}

export function HeroSlider({
  slides,
  autoPlay = true,
  autoPlayInterval = 2000,
  showNavigation = true,
  showDots = true,
  className,
  duration = 1.2,
  easing = 'power2.out',
}: HeroSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const firstSlideRef = useRef<HTMLDivElement | null>(null);
  const firstSlideContentRef = useRef<HTMLDivElement | null>(null);
  const slideContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const goToSlideRef = useRef<((index: number, force?: boolean) => void) | null>(null);
  const currentIndexRef = useRef(0);
  const isInitialAnimationCompleteRef = useRef(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
  
  // Sync ref with state
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  
  // Sync isInitialAnimationComplete ref
  useEffect(() => {
    isInitialAnimationCompleteRef.current = isInitialAnimationComplete;
  }, [isInitialAnimationComplete]);

  // Add slide to refs array
  const addToRefs = useCallback((el: HTMLDivElement | null, index: number) => {
    if (el) {
      slidesRef.current[index] = el;
      if (index === 0) {
        firstSlideRef.current = el;
      }
    }
  }, []);

  // Add content ref for slides
  const addContentRef = useCallback((el: HTMLDivElement | null, index: number) => {
    if (el) {
      slideContentRefs.current[index] = el;
      if (index === 0) {
        firstSlideContentRef.current = el;
      }
    }
  }, []);

  // Animate progress bar for current slide
  const animateProgressBar = useCallback((index: number) => {
    const progressBar = progressBarRefs.current[index];
    if (!progressBar) return;

    // Kill any existing progress timeline
    if (progressTimelineRef.current) {
      progressTimelineRef.current.kill();
    }

    // Reset all progress bars
    progressBarRefs.current.forEach((bar) => {
      if (bar) {
        gsap.set(bar, {
          scaleX: 0,
          transformOrigin: 'left center',
        });
      }
    });

    // Create new timeline for current progress bar
    progressTimelineRef.current = gsap.timeline({
      onComplete: () => {
        // When progress completes, move to next slide automatically
        // Use ref to avoid stale closure
        if (isInitialAnimationCompleteRef.current && goToSlideRef.current) {
          // Use the ref to get the most current index
          const currentIdx = currentIndexRef.current;
          const nextIndex = (currentIdx + 1) % slides.length;
          
          // Ensure we're not animating before auto-advancing
          // Use requestAnimationFrame to ensure DOM is ready
          requestAnimationFrame(() => {
            // Reset isAnimating to ensure we can proceed
            setIsAnimating(false);
            // Small delay to ensure state update
            setTimeout(() => {
              if (goToSlideRef.current) {
                // Call goToSlide with force flag to bypass checks
                goToSlideRef.current(nextIndex, true);
              }
            }, 10);
          });
        }
      },
    });

    // Animate progress bar filling from left to right
    progressTimelineRef.current.to(progressBar, {
      scaleX: 1,
      duration: autoPlayInterval / 1000, // Convert ms to seconds
      ease: 'none', // Linear progress
    });
  }, [autoPlayInterval, isInitialAnimationComplete, slides.length]);

  // Initial animation: expand first slide from center
  useEffect(() => {
    if (!firstSlideRef.current || !sliderRef.current || isInitialAnimationComplete) return;

    const container = sliderRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Initial size: 300px x 150px (minimum)
    const initialWidth = 300;
    const initialHeight = 150;
    
    // Calculate center position
    const centerX = (containerWidth - initialWidth) / 2;
    const centerY = (containerHeight - initialHeight) / 2;

    // Hide other slides during initial animation
    slidesRef.current.forEach((slide, index) => {
      if (slide && index !== 0) {
        gsap.set(slide, {
          opacity: 0,
          visibility: 'hidden',
        });
      }
    });

    // Set initial state - small rectangle in center
    gsap.set(firstSlideRef.current, {
      width: initialWidth,
      height: initialHeight,
      x: centerX,
      y: centerY,
      transformOrigin: 'center center',
    });

    // Hide text content initially
    if (firstSlideContentRef.current) {
      gsap.set(firstSlideContentRef.current, {
        opacity: 0,
        y: 20, // Slight vertical offset for fade-up effect
      });
    }

    // Animate expanding to full width and height from center
    const tl = gsap.timeline({
      onComplete: () => {
        setIsInitialAnimationComplete(true);
        // Show other slides after animation
        slidesRef.current.forEach((slide, index) => {
          if (slide && index !== 0) {
            gsap.set(slide, {
              opacity: 1,
              visibility: 'visible',
            });
          }
        });
        // Reset first slide position
        gsap.set(firstSlideRef.current, {
          width: '100%',
          height: '100%',
          x: 0,
          y: 0,
        });
      },
    });

    // Expand from center - scale from center point
    tl.to(firstSlideRef.current, {
      width: containerWidth,
      height: containerHeight,
      x: 0,
      y: 0,
      duration: duration * 1.5,
      ease: 'power3.out',
    })
      // After expansion completes, fade in text content slowly
      .to(
        firstSlideContentRef.current,
        {
          opacity: 1,
          y: 0,
          duration: duration * 1.2,
          ease: 'power2.out',
          onComplete: () => {
            // Start progress bar only after text content is visible
            setTimeout(() => {
              if (animateProgressBar) {
                animateProgressBar(0);
              }
            }, 100);
          },
        },
        '+=0.1' // Start after expansion completes (small delay)
      );
  }, [duration, isInitialAnimationComplete, slides.length, animateProgressBar]);

  // Go to specific slide
  const goToSlide = useCallback((index: number, force = false) => {
    // Use ref to check current index to avoid stale closure issues
    const currentIdx = currentIndexRef.current;
    
    // If forcing (auto-advance), skip isAnimating check but still validate index
    if (!force) {
      if (isAnimating || index === currentIdx || index < 0 || index >= slides.length) {
        return;
      }
    } else {
      // When forcing, still validate index but skip isAnimating check
      if (index < 0 || index >= slides.length || index === currentIdx) {
        return;
      }
    }
    
    setIsAnimating(true);

    const fromSlide = slidesRef.current[currentIdx];
    const toSlide = slidesRef.current[index];

    if (!fromSlide || !toSlide) {
      setIsAnimating(false);
      return;
    }

    // Hide content of new slide initially
    const newSlideContent = slideContentRefs.current[index];
    if (newSlideContent) {
      gsap.set(newSlideContent, {
        opacity: 0,
        y: 20,
      });
    }

    // Fade out current slide
    gsap.to(fromSlide, {
      opacity: 0,
      duration: duration * 0.5,
      ease: easing,
    });

    // Fade in new slide
    gsap.fromTo(
      toSlide,
      {
        opacity: 0,
        zIndex: 1,
      },
      {
        opacity: 1,
        zIndex: 2,
        duration: duration,
        ease: easing,
        onComplete: () => {
          setIsAnimating(false);
          setCurrentIndex(index);
          currentIndexRef.current = index; // Update ref for progress bar callback
          // Reset previous slide
          gsap.set(fromSlide, {
            opacity: 1,
            zIndex: 0,
          });
          
          // Fade in text content, then start progress bar
          if (newSlideContent) {
            gsap.to(newSlideContent, {
              opacity: 1,
              y: 0,
              duration: duration * 0.8,
              ease: 'power2.out',
              onComplete: () => {
                // Start progress bar only after text content is visible
                setTimeout(() => {
                  animateProgressBar(index);
                }, 100);
              },
            });
          } else {
            // If no content, start progress bar immediately
            setTimeout(() => {
              animateProgressBar(index);
            }, 100);
          }
        },
      }
    );
  }, [currentIndex, slides.length, isAnimating, duration, easing, animateProgressBar]);

  // Update ref when goToSlide changes
  useEffect(() => {
    goToSlideRef.current = goToSlide;
  }, [goToSlide]);

  // Next slide
  const nextSlide = useCallback(() => {
    if (isAnimating || !isInitialAnimationComplete) return;
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }, [currentIndex, slides.length, isAnimating, isInitialAnimationComplete, goToSlide]);

  // Previous slide
  const prevSlide = useCallback(() => {
    if (isAnimating || !isInitialAnimationComplete) return;
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  }, [currentIndex, slides.length, isAnimating, isInitialAnimationComplete, goToSlide]);

  // Auto-play functionality - replaced by progress bar timers
  // Progress bars handle auto-play now
  useEffect(() => {
    // Cleanup progress timeline on unmount
    return () => {
      if (progressTimelineRef.current) {
        progressTimelineRef.current.kill();
      }
    };
  }, []);

  return (
    <div className={cn('relative w-full', className)}>
      {/* Slider Container - Full viewport width */}
      <div
        ref={sliderRef}
        className="relative w-screen h-[600px] md:h-[700px] overflow-hidden"
        style={{ 
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)',
          width: '100vw',
          maxWidth: '100vw',
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => addToRefs(el, index)}
            className={cn(
              'absolute inset-0 w-full h-full',
              index === currentIndex ? 'z-10' : 'z-0'
            )}
            style={{
              willChange: 'transform, opacity',
            }}
          >
            <div className="w-full h-full relative">
              <img
                src={slide.image}
                alt={slide.alt || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {slide.content && (
                <div
                  ref={(el) => addContentRef(el, index)}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    willChange: 'transform, opacity',
                  }}
                >
                  {slide.content}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {showNavigation && slides.length > 1 && isInitialAnimationComplete && (
        <>
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 z-20',
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
              'absolute right-4 top-1/2 -translate-y-1/2 z-20',
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

      {/* Progress Bar Indicators */}
      {showDots && slides.length > 1 && isInitialAnimationComplete && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative h-1 bg-gray-600/50 overflow-hidden"
              style={{ width: '60px' }}
            >
              {/* Progress bar fill */}
              <div
                ref={(el) => {
                  progressBarRefs.current[index] = el;
                }}
                className="absolute inset-0 bg-white origin-left"
                style={{
                  transform: 'scaleX(0)',
                  transformOrigin: 'left center',
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

