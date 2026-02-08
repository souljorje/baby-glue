import { z } from 'zod';

export const mascotStepSchema = z.enum(['connect', 'deposit', 'unglue', 'done', 'warning']);

export const glueMetricsSchema = z.object({
  totalSupply: z.bigint(),
  userBalance: z.bigint(),
  glueEthBalance: z.bigint(),
  decimals: z.number().int().min(0).max(36),
  estimatedBackingPerToken: z.string()
});

export type MascotStep = z.infer<typeof mascotStepSchema>;
export type GlueMetrics = z.infer<typeof glueMetricsSchema>;
