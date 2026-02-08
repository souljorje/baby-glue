import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { ReactNode, useMemo } from 'react';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@config/wagmi';

const rkTheme = darkTheme({
  accentColor: '#39FF14',
  accentColorForeground: '#0B0B12',
  borderRadius: 'medium'
});

rkTheme.colors.modalBackground = '#131427';
rkTheme.colors.profileForeground = '#131427';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rkTheme}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
