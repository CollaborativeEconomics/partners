import { http, createConfig } from 'wagmi'
import { base, mainnet, arbitrumSepolia } from 'wagmi/chains'
import { injected, metaMask,} from 'wagmi/connectors'

export const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
    metaMask(),
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
})