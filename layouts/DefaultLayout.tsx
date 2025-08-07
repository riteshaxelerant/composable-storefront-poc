import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { LayoutProps } from '@/types/shared';

export function DefaultLayout({ children, title, description, source }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title ? `${title} | Composable Store` : 'Composable Store'}</title>
        {description && <meta name="description" content={description} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header source={source} />
        
        <main className="flex-1">
          {children}
        </main>
        
        <Footer source={source} />
      </div>
    </>
  );
}