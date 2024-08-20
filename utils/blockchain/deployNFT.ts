import { WalletClient } from "./client";
import { FactoryAbi, NFTAbi } from "./abis";

let deployedNFTAddress: string | null = null;

export async function deployNFT() {
    const { request } = await WalletClient.simulateContract({
        address: "ox",
        abi: FactoryAbi,
        functionName: "deployVolunteerNFT",
        args: ["", ""],   
    })

    if (!request || typeof request !== 'string' || !/^0x[a-fA-F0-9]{40}$/.test(request)) {
        throw new Error("Invalid address returned from deployVolunteerNFT");
    }

    await WalletClient.writeContract(request)

    deployedNFTAddress = request;
    return request
}

export async function mintNFT(to: string, amount: bigint, tokenId: bigint) {
    // Use the stored deployed NFT address
    if (!deployedNFTAddress) {
        throw new Error("NFT contract has not been deployed yet.");
    }

    const { request } = await WalletClient.simulateContract({
        address: deployedNFTAddress,
        abi: NFTAbi,
        functionName: "mint",
        args: [to, tokenId, amount]
    })

    await WalletClient.writeContract(request)
}

export async function getTokenURI(tokenId: bigint) {
    if (!deployedNFTAddress) {
        throw new Error("NFT not deployed");
    }

    const data = await WalletClient.readContract({
        address: deployedNFTAddress,
        abi: NFTAbi,
        functionName: "uri",
        args: [tokenId],
    })

    return data
}

