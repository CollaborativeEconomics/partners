import { http, createConfig } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
})