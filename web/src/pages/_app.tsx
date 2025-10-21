import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { WagmiProvider } from 'wagmi';
import { config } from '../lib/wagmi.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes"; // Required for sonner theming

// Create a new QueryClient instance for React Query
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    // ThemeProvider is required for sonner's dark/light theme functionality
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {/* WagmiProvider manages the wallet connection state */}
      <WagmiProvider config={config}>
        {/* QueryClientProvider is a dependency for Wagmi hooks */}
        <QueryClientProvider client={queryClient}>
          {/* This renders the current page */}
          <Component {...pageProps} />
          {/* This component renders the toast notifications */}
          <Toaster richColors />
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

