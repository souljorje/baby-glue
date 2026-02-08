import { createPublicClient, http, type Address } from 'viem';
import { baseSepolia } from 'viem/chains';
import { TOKEN_ABI } from '@config/contracts';
import { rawGlueSnapshotSchema } from './schemas';

type FetchRawGlueSnapshotParams = {
  tokenAddress: Address;
  glueAddress: Address;
  userAddress: Address;
};

const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://sepolia.base.org';

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(rpcUrl)
});

export async function fetchRawGlueSnapshot({ tokenAddress, glueAddress, userAddress }: FetchRawGlueSnapshotParams) {
  const [totalSupply, userBalance, decimals, glueEthBalance] = await Promise.all([
    publicClient.readContract({ address: tokenAddress, abi: TOKEN_ABI, functionName: 'totalSupply' }),
    publicClient.readContract({ address: tokenAddress, abi: TOKEN_ABI, functionName: 'balanceOf', args: [userAddress] }),
    publicClient.readContract({ address: tokenAddress, abi: TOKEN_ABI, functionName: 'decimals' }),
    publicClient.getBalance({ address: glueAddress })
  ]);

  return rawGlueSnapshotSchema.parse({
    totalSupply,
    userBalance,
    decimals: Number(decimals),
    glueEthBalance
  });
}

export * from './schemas';
