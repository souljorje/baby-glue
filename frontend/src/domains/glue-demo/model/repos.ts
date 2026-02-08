import { fetchRawGlueSnapshot } from '@api/glue';
import { type Address } from 'viem';
import { mapRawGlueSnapshotToMetrics } from './mappers';

type GetGlueMetricsParams = {
  tokenAddress: Address;
  glueAddress: Address;
  userAddress: Address;
};

export async function getGlueMetrics(params: GetGlueMetricsParams) {
  const rawSnapshot = await fetchRawGlueSnapshot(params);
  return mapRawGlueSnapshotToMetrics(rawSnapshot);
}
