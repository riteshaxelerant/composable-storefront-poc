import { useQuery } from '@tanstack/react-query';
import { strapiClient } from '@/lib/strapi/client';
import { GET_PAGE_BY_SLUG } from '@/graphql/strapi/queries';

interface UseStrapiPageParams {
  slug: string;
  enabled?: boolean;
}

interface UseStrapiPageResult {
  page: any | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStrapiPage({ 
  slug, 
  enabled = true 
}: UseStrapiPageParams): UseStrapiPageResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['strapi', 'page', slug],
    queryFn: async () => {
      const result = await strapiClient.query({
        query: GET_PAGE_BY_SLUG,
        variables: { slug },
        errorPolicy: 'all',
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result.data?.pages?.[0] || null;
    },
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    page: data || null,
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
  };
} 