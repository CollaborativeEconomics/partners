import { createPublicClient, createWalletClient, custom, PublicActions, http, publicActions } from "viem";
import { arbitrumSepolia } from "viem/chains";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const PublicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

export let walletClient;
export let account;

export const initializeWallet = () => {
  if (typeof window !== 'undefined') {
    console.log('initializing wallet')
    walletClient = createWalletClient({
      chain: arbitrumSepolia,
      transport: custom(window.ethereum)
    }).extend(publicActions)
    // [account] = walletClient.getAddress();
  }
}

// export const WalletClient = createWalletClient({
//   account,
//   chain: arbitrumSepolia,
//   transport: custom(window.ethereum)
// }).extend(publicActions)