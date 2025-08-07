import { useQuery } from '@tanstack/react-query';
import { magentoClient } from '@/lib/magento/client';
import { GET_PRODUCTS_BY_CATEGORY } from '@/graphql/magento/queries';
import type { MagentoProduct } from '@/types/magento';

interface UseProductsByCategoryParams {
  categoryUid: string;
  enabled?: boolean;
}

interface UseProductsByCategoryResult {
  products: MagentoProduct[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProductsByCategory({ 
  categoryUid, 
  enabled = true 
}: UseProductsByCategoryParams): UseProductsByCategoryResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['magento', 'products', 'by-category', categoryUid],
    queryFn: async () => {
      const result = await magentoClient.query({
        query: GET_PRODUCTS_BY_CATEGORY,
        variables: { categoryUid },
        errorPolicy: 'all',
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result.data?.products?.items || [];
    },
    enabled: enabled && !!categoryUid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    products: data || null,
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
  };
}