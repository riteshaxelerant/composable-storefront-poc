import { useQuery } from '@tanstack/react-query';
import { strapiClient } from '@/lib/strapi/client';
import { GET_KITCHEN_ESTIMATOR } from '@/graphql/strapi/queries';

interface UseKitchenEstimatorResult {
  kitchenEstimator: any | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useKitchenEstimator(): UseKitchenEstimatorResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['strapi', 'kitchen-estimator'],
    queryFn: async () => {
      const result = await strapiClient.query({
        query: GET_KITCHEN_ESTIMATOR,
        errorPolicy: 'all',
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result.data?.kitchenEstimator || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    kitchenEstimator: data || null,
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
  };
}
