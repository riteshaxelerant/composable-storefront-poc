import React from 'react';
import type { ContentSource } from '@/types/shared';

interface FooterProps {
  source?: ContentSource;
}

export function Footer({ source }: FooterProps) {
  return (
    <footer className="bg-secondary-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Composable Store</h3>
            <p className="text-secondary-400">
              A modern composable commerce solution built with Next.js
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-secondary-400">
              <li><a href="/categories" className="hover:text-white">Categories</a></li>
              <li><a href="/products" className="hover:text-white">Products</a></li>
              <li><a href="/search" className="hover:text-white">Search</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Content</h4>
            <ul className="space-y-2 text-secondary-400">
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-secondary-400">
              <li><a href="/help" className="hover:text-white">Help Center</a></li>
              <li><a href="/shipping" className="hover:text-white">Shipping</a></li>
              <li><a href="/returns" className="hover:text-white">Returns</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-secondary-800 text-center">
          <div className="flex items-center justify-between">
            <p className="text-secondary-400">
              © 2024 Composable Store. All rights reserved.
            </p>
            {source && (
              <span className="text-xs text-secondary-500">
                Powered by {source === 'magento' ? 'Magento' : 'Strapi'}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}