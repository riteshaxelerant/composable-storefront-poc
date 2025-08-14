import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { LayoutProps } from '@/types/shared';

export function DefaultLayout({ children, title, description, source }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header source={source} />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer source={source} />
    </div>
  );
}