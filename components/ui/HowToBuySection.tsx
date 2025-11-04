'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StepData {
  number: number;
  title: string;
  description: string;
  cta: string;
  ctaHref?: string;
}

interface HowToBuySectionProps {
  title?: string;
  subtitle?: string;
  steps: StepData[];
  className?: string;
}

export function HowToBuySection({
  title = "How to buy",
  subtitle = "We're with you every step of the way, from designing your dream kitchen to its professional installation.",
  steps,
  className,
}: HowToBuySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || numberRefs.current.length === 0) return;

    // Set initial state - numbers and circles hidden
    numberRefs.current.forEach((numberEl) => {
      if (numberEl) {
        gsap.set(numberEl, {
          opacity: 0,
          scale: 0,
        });
      }
    });

    circleRefs.current.forEach((circleEl) => {
      if (circleEl) {
        gsap.set(circleEl, {
          scale: 0,
        });
      }
    });

    // Create scroll trigger animation
    steps.forEach((step, index) => {
      const numberEl = numberRefs.current[index];
      const circleEl = circleRefs.current[index];

      if (!numberEl || !circleEl) return;

      // Create timeline for each number with stagger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%', // Start animation when section is 80% down the viewport
          toggleActions: 'play none none none',
          once: true, // Only animate once
        },
        delay: index * 0.3, // Stagger delay: 0s, 0.3s, 0.6s
      });

      // Animate circle background appearing first with elastic bounce
      tl.to(circleEl, {
        scale: 1,
        duration: 0.7,
        ease: 'back.out(1.5)', // Elastic bounce effect
      })
        // Then animate number appearing
        .to(
          numberEl,
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.3' // Start 0.3s before circle animation finishes
        );
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [steps]);

  return (
    <section
      ref={sectionRef}
      className={`py-16 bg-secondary-50 ${className || ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary-900 mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-secondary-700 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex flex-col items-center text-center"
            >
              {/* Number Circle */}
              <div className="relative mb-6">
                {/* Copper Circle Background */}
                <div
                  ref={(el) => {
                    circleRefs.current[index] = el;
                  }}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full"
                  style={{
                    backgroundColor: '#CD9B84', // Copper/terracotta color
                    transformOrigin: 'center center',
                  }}
                />
                {/* White Number */}
                <div
                  ref={(el) => {
                    numberRefs.current[index] = el;
                  }}
                  className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl font-bold text-white"
                  style={{
                    transformOrigin: 'center center',
                  }}
                >
                  {step.number}
                </div>
              </div>

              {/* Step Content */}
              <h3 className="text-xl md:text-2xl font-semibold text-secondary-900 mb-4">
                {step.title}
              </h3>
              <p className="text-secondary-700 mb-6 text-left md:text-center">
                {step.description}
              </p>
              <a
                href={step.ctaHref || '#'}
                className="text-secondary-900 font-medium hover:text-secondary-700 transition-colors inline-flex items-center gap-2"
              >
                {step.cta}
                <span>→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

