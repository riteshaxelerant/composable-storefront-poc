import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Composable commerce storefront powered by Magento and Strapi',
};

export default function HomePage() {
  return (
    <DefaultLayout 
      title="Home" 
      description="Composable commerce storefront powered by Magento and Strapi"
    >
      <div className="min-h-screen bg-secondary-50">

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Composable Commerce Demo
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            A proof-of-concept showcasing how to stitch together Magento and Strapi 
            GraphQL backends into a unified shopping experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/categories">
              <Button size="lg" variant="secondary">
                Browse Categories
              </Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-primary-50">
                Read Our Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-secondary-900 text-center mb-12">
            Key Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <h4 className="text-lg font-semibold text-secondary-900">
                  Single Entry Point
                </h4>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  All URLs are handled through a single catch-all route that intelligently 
                  routes to the appropriate data source and component.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h4 className="text-lg font-semibold text-secondary-900">
                  Composable Adapters
                </h4>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  Plug-and-play architecture allows easy swapping of data sources. 
                  Add new CMS or commerce platforms with minimal code changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h4 className="text-lg font-semibold text-secondary-900">
                  Smart URL Resolution
                </h4>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  Sequential resolution through multiple backends with automatic 
                  fallback to 404 if no content is found.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h4 className="text-lg font-semibold text-secondary-900">
                  Type-Safe Hooks
                </h4>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  Composable React hooks with built-in loading states, error handling, 
                  and intelligent caching via React Query.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h4 className="text-lg font-semibold text-secondary-900">
                  Unified Search
                </h4>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  Search across multiple content sources with intelligent ranking 
                  and unified result presentation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h4 className="text-lg font-semibold text-secondary-900">
                  Performance Optimized
                </h4>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  Built with Next.js 14, featuring server-side rendering, 
                  static generation, and optimized bundle splitting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-secondary-900 text-center mb-12">
            How It Works
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                URL Resolution
              </h4>
              <p className="text-secondary-600">
                Each request is analyzed by middleware that determines the appropriate 
                data source and content type.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                Data Fetching
              </h4>
              <p className="text-secondary-600">
                Content is fetched from the appropriate backend using optimized 
                GraphQL queries and composable hooks.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                Unified Rendering
              </h4>
              <p className="text-secondary-600">
                Content is rendered using a unified component system that provides 
                consistent styling and user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Explore?
          </h3>
          <p className="text-xl text-primary-100 mb-8">
            Start browsing our catalog or dive into our latest blog posts to see 
            the composable architecture in action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" variant="secondary">
                View Products
              </Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-primary-50">
                Read Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      </div>
    </DefaultLayout>
  );
}
