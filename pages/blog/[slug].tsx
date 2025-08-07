import React from 'react';
import { GetServerSideProps } from 'next';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { ArticleDetail } from '@/components/strapi/ArticleDetail';

interface BlogDetailPageProps {
  slug: string;
}

export default function BlogDetailPage({ slug }: BlogDetailPageProps) {
  return (
    <DefaultLayout 
      title="Article" 
      description="Read our latest article"
      source="strapi"
    >
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleDetail slug={slug} />
        </div>
      </div>
    </DefaultLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  
  if (!slug) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug,
    },
  };
};