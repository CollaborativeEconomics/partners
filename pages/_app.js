import 'styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../chains/config'

const inter = Inter({ subsets: ['latin'] })
const queryClient = new QueryClient()

export default function App({Component, pageProps}) {
  return (
    <SessionProvider>
      <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
      </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  )
}
