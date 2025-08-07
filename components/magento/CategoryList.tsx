import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCategories } from '@/composables/magento/useCategories';
import type { MagentoCategory } from '@/types/magento';

interface CategoryItemProps {
  category: MagentoCategory;
  level?: number;
}

function CategoryItem({ category, level = 0 }: CategoryItemProps) {
  const indent = level * 20;
  
  return (
    <div style={{ marginLeft: indent }}>
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-secondary-900">
                {category.name}
              </h3>
              <p className="text-sm text-secondary-600">
                Level {category.level} • UID: {category.uid}
              </p>
              <p className="text-xs text-secondary-500">
                Path: {category.url_path}
              </p>
            </div>
            <Link 
              href={`/category/${category.url_path}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View Category →
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {category.children && category.children.length > 0 && (
        <div className="ml-4">
          {category.children.map((child) => (
            <CategoryItem 
              key={child.uid} 
              category={child} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryList() {
  const { categories, loading, error } = useCategories();

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
            Error Loading Categories
          </h3>
          <p className="text-secondary-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            No Categories Found
          </h3>
          <p className="text-secondary-600">
            No categories are available from Magento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          Magento Categories
        </h2>
        <p className="text-secondary-600">
          Browse all available categories from Magento store
        </p>
      </div>
      
      {categories.map((category) => (
        <CategoryItem key={category.uid} category={category} />
      ))}
    </div>
  );
}