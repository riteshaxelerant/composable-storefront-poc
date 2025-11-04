'use client';

import React from 'react';
import { Carousel, SlideData } from './Carousel';

const demoSlides: SlideData[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=700&h=700&fit=crop',
    alt: 'Modern Architecture',
    content: (
      <div className="text-center text-white px-8">
        <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">Welcome to Our Store</h2>
        <p className="text-xl mb-6 drop-shadow-md max-w-2xl mx-auto">
          Discover amazing products with seamless shopping experience
        </p>
      </div>
    ),
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&h=700&fit=crop',
    alt: 'Shopping Experience',
    content: (
      <div className="text-center text-white px-8">
        <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">Premium Quality</h2>
        <p className="text-xl mb-6 drop-shadow-md max-w-2xl mx-auto">
          Handpicked selection of the finest products just for you
        </p>
      </div>
    ),
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&h=700&fit=crop',
    alt: 'Technology',
    content: (
      <div className="text-center text-white px-8">
        <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">Innovation First</h2>
        <p className="text-xl mb-6 drop-shadow-md max-w-2xl mx-auto">
          Cutting-edge solutions for modern lifestyle
        </p>
      </div>
    ),
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700&h=700&fit=crop',
    alt: 'Lifestyle',
    content: (
      <div className="text-center text-white px-8">
        <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">Your Style, Your Way</h2>
        <p className="text-xl mb-6 drop-shadow-md max-w-2xl mx-auto">
          Express yourself with our curated collection
        </p>
      </div>
    ),
  },
];

export function CarouselDemo() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-secondary-900 mb-2">
          GSAP Carousel Demo
        </h3>
        <p className="text-secondary-600">
          Smooth slow-motion transitions with blur and expansion effects
        </p>
      </div>
      <div className=" overflow-hidden shadow-2xl">
        <Carousel
          slides={demoSlides}
          autoPlay={true}
          autoPlayInterval={4000}
          showNavigation={true}
          showDots={true}
          duration={1.2}
          easing="power2.out"
          blurAmount={2}
          className="h-[700px]"
        />
      </div>
    </div>
  );
}

