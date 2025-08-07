import React from 'react';
import Link from 'next/link';
import type { ContentSource } from '@/types/shared';

interface HeaderProps {
  source?: ContentSource;
}

export function Header({ source }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-600">
              Composable Store
            </Link>
            {source && (
              <span className="ml-2 px-2 py-1 text-xs bg-secondary-100 text-secondary-600 rounded">
                {source}
              </span>
            )}
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-secondary-600 hover:text-secondary-900">
              Home
            </Link>
            <Link href="/categories" className="text-secondary-600 hover:text-secondary-900">
              Categories
            </Link>
            <Link href="/blog" className="text-secondary-600 hover:text-secondary-900">
              Blog
            </Link>
            <Link href="/about" className="text-secondary-600 hover:text-secondary-900">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}