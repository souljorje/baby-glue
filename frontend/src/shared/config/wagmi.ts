import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'baby-glue';
const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://sepolia.base.org';

export const wagmiConfig = getDefaultConfig({
  appName: 'Baby Glue',
  projectId: walletConnectProjectId,
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(rpcUrl)
  }
});
