import { FactoryAbi, NFTAbi } from "../../chains/contracts/abis";
import { useWriteContract } from "wagmi";
import { type UseWriteContractParameters } from 'wagmi'

let deployedNFTAddress: string | null = null;

export async function deployNFT(address: `0x${string}`) {
    
}

export async function mintNFT(to: string, amount: bigint, tokenId: bigint) {
    // Use the stored deployed NFT address
    if (!deployedNFTAddress) {
        throw new Error("NFT contract has not been deployed yet.");
    }

    const { request } = await walletClient.simulateContract({
        address: deployedNFTAddress,
        abi: NFTAbi,
        functionName: "mint",
        args: [to, tokenId, amount],
        account
    })

    await walletClient.writeContract(request)
}

export async function getTokenURI(tokenId: bigint) {
    if (!deployedNFTAddress) {
        throw new Error("NFT not deployed");
    }

    const data = await walletClient.readContract({
        address: deployedNFTAddress,
        abi: NFTAbi,
        functionName: "uri",
        args: [tokenId],
        account
    })

    return data
}

