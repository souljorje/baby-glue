import { formatTokenAmount } from '@lib/format';
import { Card } from '@ui/card';
import type { GlueMetrics } from '../model/schemas';

type GlueMetricsProps = {
  metrics?: GlueMetrics;
  isLoading: boolean;
};

const metricMeta = [
  { label: 'Cookie Jar ETH', suffix: ' ETH', accent: 'text-brand' },
  { label: 'My Coupons', suffix: '', accent: 'text-pink' },
  { label: 'All Coupons', suffix: '', accent: 'text-blue' },
  { label: 'Cookies Per Coupon', suffix: ' ETH', accent: 'text-yellow' }
] as const;

export function GlueMetricsPanel({ metrics, isLoading }: GlueMetricsProps) {
  const totalSupply = metrics ? formatTokenAmount(metrics.totalSupply, metrics.decimals, 2) : '--';
  const userBalance = metrics ? formatTokenAmount(metrics.userBalance, metrics.decimals, 4) : '--';
  const glueBalance = metrics ? formatTokenAmount(metrics.glueEthBalance, 18, 4) : '--';
  const backingPerToken = metrics ? metrics.estimatedBackingPerToken : '--';

  const values = [glueBalance, userBalance, totalSupply, backingPerToken];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metricMeta.map((meta, i) => (
        <Card key={meta.label}>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{meta.label}</p>
          <p className={`mt-2 text-2xl font-black ${meta.accent}`}>
            {isLoading ? '...' : `${values[i]}${meta.suffix}`}
          </p>
        </Card>
      ))}
    </section>
  );
}
