import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useArticles } from '@/composables/strapi/useArticles';
import type { StrapiArticle } from '@/types/strapi';

interface ArticleItemProps {
  article: StrapiArticle;
}

function ArticleItem({ article }: ArticleItemProps) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString();
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {article.cover && (
          <div className="aspect-video relative bg-secondary-200 rounded-t-lg overflow-hidden">
            <Image
              src={`http://localhost:1337${article.cover.url}`}
              alt={article.cover.alternativeText || article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-secondary-600 line-clamp-3">
              {article.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {article.author && (
                <span className="text-secondary-600">
                  By {article.author.name}
                </span>
              )}
              {article.category && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                  {article.category.name}
                </span>
              )}
            </div>
            <span className="text-secondary-500">
              {publishedDate}
            </span>
          </div>
          
          <div className="pt-2">
            <Link 
              href={`/blog/${article.slug}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Read More →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ArticleListProps {
  limit?: number;
  start?: number;
}

export function ArticleList({ limit = 10, start = 0 }: ArticleListProps) {
  const { articles, loading, error } = useArticles({ limit, start });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Error Loading Articles
          </h3>
          <p className="text-secondary-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            No Articles Found
          </h3>
          <p className="text-secondary-600">
            No articles are available from Strapi.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          Latest Articles ({articles.length})
        </h2>
        <p className="text-secondary-600">
          Recent blog posts from Strapi CMS
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleItem key={article.documentId} article={article} />
        ))}
      </div>
    </div>
  );
}