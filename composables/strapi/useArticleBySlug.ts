import { useQuery } from '@tanstack/react-query';
import { strapiClient } from '@/lib/strapi/client';
import { GET_ARTICLE_BY_SLUG } from '@/graphql/strapi/queries';
import type { StrapiArticle } from '@/types/strapi';

interface UseArticleBySlugResult {
  article: StrapiArticle | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useArticleBySlug(slug: string): UseArticleBySlugResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['strapi', 'article', slug],
    queryFn: async () => {
      const result = await strapiClient.query({
        query: GET_ARTICLE_BY_SLUG,
        variables: { slug },
        errorPolicy: 'all',
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      const articles = result.data?.articles || [];
      return articles.length > 0 ? articles[0] : null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    article: data || null,
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
  };
}