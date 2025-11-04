'use client';

import React from 'react';
import { HowToBuySection } from './HowToBuySection';

const steps = [
  {
    number: 1,
    title: 'Plan your kitchen',
    description: 'Find inspiration and discover kitchens you\'ll love. Design the kitchen you\'ve always wanted.',
    cta: 'Browse kitchens',
    ctaHref: '/categories',
  },
  {
    number: 2,
    title: 'Design with expert guidance',
    description: 'Book an appointment to visit our showroom.',
    cta: 'Book an appointment',
    ctaHref: '/book',
  },
  {
    number: 3,
    title: 'You are in safe hands',
    description: 'From measuring through installation, we are with you every step of the way.',
    cta: 'White glove service',
    ctaHref: '/services',
  },
];

export function HowToBuyDemo() {
  return (
    <HowToBuySection
      title="How to buy"
      subtitle="We're with you every step of the way, from designing your dream kitchen to its professional installation."
      steps={steps}
    />
  );
}

