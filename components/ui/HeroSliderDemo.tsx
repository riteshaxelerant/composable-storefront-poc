'use client';

import React from 'react';
import { HeroSlider, HeroSlideData } from './HeroSlider';

const heroSlides: HeroSlideData[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1920&h=1080&fit=crop',
    alt: 'Modern Kitchen Design',
    content: (
      <div className="text-center text-white px-8">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          Design Your Dream Kitchen
        </h1>
        <p className="text-2xl md:text-3xl mb-8 drop-shadow-md max-w-3xl mx-auto">
          Premium quality kitchens crafted to perfection
        </p>
      </div>
    ),
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop',
    alt: 'Luxury Kitchen',
    content: (
      <div className="text-center text-white px-8">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          Luxury Redefined
        </h1>
        <p className="text-2xl md:text-3xl mb-8 drop-shadow-md max-w-3xl mx-auto">
          Experience elegance in every detail
        </p>
      </div>
    ),
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop',
    alt: 'Modern Living',
    content: (
      <div className="text-center text-white px-8">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          Modern Living Spaces
        </h1>
        <p className="text-2xl md:text-3xl mb-8 drop-shadow-md max-w-3xl mx-auto">
          Where style meets functionality
        </p>
      </div>
    ),
  },
];

export function HeroSliderDemo() {
  return (
    <HeroSlider
      slides={heroSlides}
      autoPlay={true}
      autoPlayInterval={6000}
      showNavigation={true}
      showDots={true}
      duration={1.5}
      easing="power3.out"
    />
  );
}

