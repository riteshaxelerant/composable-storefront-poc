'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';

interface BlogPost {
  id: string;
  title: string;
  link?: string | null;
  summary: string;
  image?: {
    alternativeText?: string;
    caption?: string;
    url: string;
  };
}

interface BlogPostsTeaserProps {
  section: {
    id: string;
    __typename: string;
    sectionTitle: string;
    posts: BlogPost[];
  };
}

function BlogPostItem({ post }: { post: BlogPost }) {
  // Get Strapi base URL for images
  const getStrapiImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL?.replace('/graphql', '') || 'http://localhost:1337';
    return `${strapiBaseUrl}${url}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        {post.image && (
          <div className="aspect-video relative bg-secondary-200 rounded-t-lg overflow-hidden">
            <img
              src={getStrapiImageUrl(post.image.url)}
              alt={post.image.alternativeText || post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://picsum.photos/600/400?random=' + post.id;
              }}
            />
          </div>
        )}
        
        <div className="p-6 space-y-3">
          <div>
            <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 text-lg">
              {post.title}
            </h3>
            <p className="text-sm text-secondary-600 line-clamp-3 leading-relaxed">
              {post.summary}
            </p>
          </div>
          
          {post.link && post.link.trim() !== '' && (
            <div className="pt-2 border-t border-secondary-100">
              <Link 
                href={post.link}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200"
              >
                <span>Read More</span>
                <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function BlogPostsTeaser({ section }: BlogPostsTeaserProps) {
  if (!section.posts || section.posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            {section.sectionTitle}
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Latest insights and updates from our blog
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.posts.map((post) => (
            <BlogPostItem key={post.id} post={post} />
          ))}
        </div>

        {/* View All Blog Posts Link */}
        <div className="text-center mt-12">
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
          >
            <span>View All Blog Posts</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Blog Post Count */}
        <div className="text-center mt-6">
          <p className="text-sm text-secondary-500">
            Showing {section.posts.length} recent blog post{section.posts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* CSS for line-clamp */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
