import { z } from 'zod';

export const rawGlueSnapshotSchema = z.object({
  totalSupply: z.bigint(),
  userBalance: z.bigint(),
  decimals: z.number().int().min(0).max(36),
  glueEthBalance: z.bigint()
});

export type RawGlueSnapshot = z.infer<typeof rawGlueSnapshotSchema>;
