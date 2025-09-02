'use client';

import React from 'react';
import { HeroBanner } from './sections/HeroBanner';
import { ProductSlider } from './sections/ProductSlider';
import { Testimonials } from './sections/Testimonials';
import { FaqSection } from './sections/FaqSection';
import { BlogPostsTeaser } from './sections/BlogPostsTeaser';
import { RichTextBlock } from './sections/RichTextBlock';
import { PromotionalCta } from './sections/PromotionalCta';
import { CategoryHighlight } from './sections/CategoryHighlight';
import { ImageCarousel } from './sections/ImageCarousel';
import { FeatureGrid } from './sections/FeatureGrid';

interface SectionRendererProps {
  section: any;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const componentMap: Record<string, React.ComponentType<any>> = {
    'ComponentSectionsHeroBanner': HeroBanner,
    'ComponentSectionsProductSlider': ProductSlider,
    'ComponentSectionsTestimonials': Testimonials,
    'ComponentSectionsFaqSection': FaqSection,
    'ComponentSectionsBlogPostsTeaser': BlogPostsTeaser,
    'ComponentSectionsRichTextBlock': RichTextBlock,
    'ComponentSectionsPromotionalCta': PromotionalCta,
    'ComponentSectionsCategoryHighlight': CategoryHighlight,
    'ComponentSectionsImageCarousel': ImageCarousel,
    'ComponentSectionsFeatureGrid': FeatureGrid,
    // Add other section components here as we build them
    // etc.
  };

  const Component = componentMap[section.__typename];

  if (!Component) {
    // Fallback for unknown section types - show raw data for development
    return (
      <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-6 my-4">
        <h4 className="font-medium text-yellow-800 mb-2">
          Unknown Section Type: {section.__typename}
        </h4>
        <pre className="text-xs text-yellow-700 bg-yellow-100 p-3 rounded overflow-auto max-h-48">
          {JSON.stringify(section, null, 2)}
        </pre>
      </div>
    );
  }

  return <Component section={section} />;
}
