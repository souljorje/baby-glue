import useSWR from 'swr';
import { type Address } from 'viem';
import { getGlueMetrics } from './repos';

type UseGlueMetricsQueryParams = {
  tokenAddress: Address;
  glueAddress: Address;
  userAddress?: Address;
};

export function useGlueMetricsQuery({ tokenAddress, glueAddress, userAddress }: UseGlueMetricsQueryParams) {
  return useSWR(
    userAddress ? ['glue-metrics', tokenAddress, glueAddress, userAddress] : null,
    () => getGlueMetrics({ tokenAddress, glueAddress, userAddress: userAddress as Address }),
    {
      revalidateOnFocus: false,
      refreshInterval: 12_000
    }
  );
}
