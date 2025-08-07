import React from 'react';
import Link from 'next/link';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
                  Modern UI Components
                </h4>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  Beautiful, responsive components built with Tailwind CSS and 
                  following modern design patterns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h4 className="text-lg font-semibold text-secondary-900">
                  Production Ready
                </h4>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  Built with TypeScript, proper error handling, performance optimization, 
                  and SEO best practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Links Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-secondary-900 text-center mb-12">
            Try These Demo Routes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="text-center p-6">
                <h4 className="font-semibold text-secondary-900 mb-2">Magento Product</h4>
                <p className="text-sm text-secondary-600 mb-4">
                  Sample product page from Magento
                </p>
                <Link href="/categories">
                  <Button size="sm" className="w-full">
                    View Categories
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="text-center p-6">
                <h4 className="font-semibold text-secondary-900 mb-2">Magento Category</h4>
                <p className="text-sm text-secondary-600 mb-4">
                  Sample category page from Magento
                </p>
                <Link href="/categories">
                  <Button size="sm" className="w-full">
                    View Categories
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="text-center p-6">
                <h4 className="font-semibold text-secondary-900 mb-2">Magento CMS</h4>
                <p className="text-sm text-secondary-600 mb-4">
                  Sample CMS page from Magento
                </p>
                <Link href="/cms/about-us">
                  <Button size="sm" className="w-full">
                    View CMS Page
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="text-center p-6">
                <h4 className="font-semibold text-secondary-900 mb-2">Strapi Page</h4>
                <p className="text-sm text-secondary-600 mb-4">
                  Sample page from Strapi CMS
                </p>
                <Link href="/blog">
                  <Button size="sm" className="w-full">
                    Read Blog
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
    </DefaultLayout>
  );
} 