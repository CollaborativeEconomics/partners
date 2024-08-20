import { createThirdwebClient } from "thirdweb";
import { createPublicClient, createWalletClient, custom, PublicActions, http, publicActions } from "viem";
import { arbitrumSepolia } from "viem/chains";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const [account] = await window.ethereum!.request({ method: 'eth_requestAccounts' })

// const clientId = process.env.THIRDWEB_CLIENT_ID;

// if (!clientId) {
//   throw new Error("No client ID provided");
// }

export const PublicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

export const WalletClient = createWalletClient({
  account,
  chain: arbitrumSepolia,
  transport: custom(window.ethereum)
}).extend(publicActions)