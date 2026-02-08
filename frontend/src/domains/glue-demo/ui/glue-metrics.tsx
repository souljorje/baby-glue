import { formatTokenAmount } from '@lib/format';
import { Card } from '@ui/card';
import type { GlueMetrics } from '../model/schemas';

type GlueMetricsProps = {
  metrics?: GlueMetrics;
  isLoading: boolean;
};

export function GlueMetricsPanel({ metrics, isLoading }: GlueMetricsProps) {
  const totalSupply = metrics ? formatTokenAmount(metrics.totalSupply, metrics.decimals, 2) : '--';
  const userBalance = metrics ? formatTokenAmount(metrics.userBalance, metrics.decimals, 4) : '--';
  const glueBalance = metrics ? formatTokenAmount(metrics.glueEthBalance, 18, 4) : '--';
  const backingPerToken = metrics ? metrics.estimatedBackingPerToken : '--';

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Piggy Bank ETH</p>
        <p className="mt-2 text-2xl font-black text-foreground">{isLoading ? '...' : `${glueBalance} ETH`}</p>
      </Card>
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">My Tokens</p>
        <p className="mt-2 text-2xl font-black text-foreground">{isLoading ? '...' : userBalance}</p>
      </Card>
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">All Tokens</p>
        <p className="mt-2 text-2xl font-black text-foreground">{isLoading ? '...' : totalSupply}</p>
      </Card>
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Backing Per Token</p>
        <p className="mt-2 text-2xl font-black text-foreground">{isLoading ? '...' : `${backingPerToken} ETH`}</p>
      </Card>
    </section>
  );
}
