import { useQuery } from '@tanstack/react-query';
import { strapiClient } from '@/lib/strapi/client';
import { GET_ARTICLES } from '@/graphql/strapi/queries';
import type { StrapiArticle } from '@/types/strapi';

interface UseArticlesParams {
  limit?: number;
  start?: number;
  status?: 'PUBLISHED' | 'DRAFT';
}

interface UseArticlesResult {
  articles: StrapiArticle[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useArticles({ 
  limit = 10, 
  start = 0, 
  status = 'PUBLISHED' 
}: UseArticlesParams = {}): UseArticlesResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['strapi', 'articles', limit, start, status],
    queryFn: async () => {
      const result = await strapiClient.query({
        query: GET_ARTICLES,
        variables: { limit, start, status },
        errorPolicy: 'all',
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result.data?.articles || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    articles: data || null,
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
  };
}