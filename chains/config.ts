import { http, createConfig } from 'wagmi'
//import { arbitrumSepolia } from 'wagmi/chains'
import * as wagmiChains from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

const arbitrumSepolia = wagmiChains['arbitrumSepolia']

export const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [metaMask()],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
})