'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useProductsByCategory } from '@/composables/magento/useProductsByCategory';
import type { MagentoProduct } from '@/types/magento';

interface ProductListProps {
  categoryUid: string;
}

interface ProductItemProps {
  product: MagentoProduct;
}

function ProductItem({ product }: ProductItemProps) {
  const price = product.price_range?.minimum_price?.regular_price?.value || 0;
  const currency = product.price_range?.minimum_price?.regular_price?.currency || 'USD';
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-secondary-900 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-secondary-600">
              SKU: {product.sku}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-primary-600">
                {currency} {price.toFixed(2)}
              </p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                product.stock_status === 'IN_STOCK' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock_status === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <Link 
              href={`/product/${product.url_key}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View Product →
            </Link>
          </div>
          
          {product.description?.html && (
            <div 
              className="text-sm text-secondary-600 prose prose-sm max-w-none line-clamp-3"
              dangerouslySetInnerHTML={{ 
                __html: product.description.html.substring(0, 150) + '...' 
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductList({ categoryUid }: ProductListProps) {
  const { products, loading, error } = useProductsByCategory({ categoryUid });

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
            Error Loading Products
          </h3>
          <p className="text-secondary-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            No Products Found
          </h3>
          <p className="text-secondary-600">
            No products are available in this category.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          Products ({products.length})
        </h2>
        <p className="text-secondary-600">
          Products from Magento category
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}