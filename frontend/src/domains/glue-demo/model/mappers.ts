import { calculateBackingPerToken } from '@lib/format';
import type { RawGlueSnapshot } from '@api/glue/schemas';
import { glueMetricsSchema } from './schemas';

export function mapRawGlueSnapshotToMetrics(rawSnapshot: RawGlueSnapshot) {
  const estimatedBackingPerToken = calculateBackingPerToken(rawSnapshot.glueEthBalance, rawSnapshot.totalSupply, rawSnapshot.decimals);

  return glueMetricsSchema.parse({
    totalSupply: rawSnapshot.totalSupply,
    userBalance: rawSnapshot.userBalance,
    glueEthBalance: rawSnapshot.glueEthBalance,
    decimals: rawSnapshot.decimals,
    estimatedBackingPerToken
  });
}
