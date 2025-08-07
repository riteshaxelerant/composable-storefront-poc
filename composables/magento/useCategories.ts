import { useQuery } from '@tanstack/react-query';
import { magentoClient } from '@/lib/magento/client';
import { GET_CATEGORIES } from '@/graphql/magento/queries';
import type { MagentoCategory } from '@/types/magento';

interface UseCategoriesResult {
  categories: MagentoCategory[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCategories(): UseCategoriesResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['magento', 'categories'],
    queryFn: async () => {
      const result = await magentoClient.query({
        query: GET_CATEGORIES,
        errorPolicy: 'all',
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result.data?.categoryList || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: true,
    refetchOnWindowFocus: false,
  });

  return {
    categories: data || null,
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
  };
}