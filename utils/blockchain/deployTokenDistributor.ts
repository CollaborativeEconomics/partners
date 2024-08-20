import { WalletClient } from "./client";
import { FactoryAbi, DistributorAbi } from "./abis";

let deployedDistributorAddress: string | null = null;

export async function deployDistributor() {
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

    deployedDistributorAddress = request;
    return request
}

export async function distributeTokenEqually(tokenId: bigint) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await WalletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "distributeTokensEqually",
        args: [tokenId],
    })


    await WalletClient.writeContract(request)

    return request
}

export async function distributeTokenByUnit(tokenId: bigint) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await WalletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "distributeTokensByUnit",
        args: [tokenId],
    })


    await WalletClient.writeContract(request)

    return request
}

export async function whitelistAddresses(addresses: string[]) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await WalletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "whitelistAddresses",
        args: [addresses],
    })


    await WalletClient.writeContract(request)

    return request
}

export async function removeFromWhitelist(address: string) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await WalletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "removeFromWhitelist",
        args: [address],
    })


    await WalletClient.writeContract(request)

    return request
}

export async function updateBaseFee(baseFee: bigint) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await WalletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "updateBaseFee",
        args: [baseFee],
    })


    await WalletClient.writeContract(request)

    return request
}

export async function transferOwnership(newOwner: string) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await WalletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "transferOwnership",
        args: [newOwner],
    })

    await WalletClient.writeContract(request)

    return request
}

export async function updateWhitelist(address: string) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await WalletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "updateWhitelist",
        args: [address],
    })

    await WalletClient.writeContract(request)

    return request
}

export async function addTokenAddress(tokenAddress: string) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await WalletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "addTokenAddress",
        args: [tokenAddress],
    })

    await WalletClient.writeContract(request)

    return request
}

export async function getBaseFee() {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const data = await WalletClient.readContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "getBaseFee",
        args: [],
    })

    return data
}

export async function getTokens() {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const data = await WalletClient.readContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "getTokens",
        args: [],
    })

    return data
}

export async function getWhitelistedAddresses() {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const data = await WalletClient.readContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "getWhitelistedAddresses",
        args: [],
    })

    return data
}

export async function isWhitelisted(address: string) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const data = await WalletClient.readContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "isWhitelisted",
        args: [address],
    })

    return data
}

export async function owner() {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const data = await WalletClient.readContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "owner",
        args: [],
    })

    return data
}

export async function registeredAddresses(index: bigint) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const data = await WalletClient.readContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "registeredAddresses",
        args: [index],
    })

    return data
}

