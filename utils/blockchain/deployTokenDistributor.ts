
import { FactoryAbi, DistributorAbi } from "../../chains/contracts/abis";
import { useWriteContract } from "wagmi";

let deployedDistributorAddress: string | null = null;

export async function deployDistributor( address: `0x${string}` ) {
    console.log('DEPLOY')
    const { data: hash, writeContract } = useWriteContract();


    writeContract({
        address: usdcAddressMainnet,
        abi: FactoryAbi,
        functionName: "deployVolunteerNFT",
        args: [usdcAddressTestnet, address],
    })

    if (!request || typeof request !== 'string' || !/^0x[a-fA-F0-9]{40}$/.test(request)) {
        throw new Error("Invalid address returned from deployVolunteerNFT");
    }

    await walletClient.writeContract(request)

    deployedDistributorAddress = request;
    return request
}

// export async function distributeTokenEqually(tokenId: bigint) {
//     if (!deployedDistributorAddress) {
//         throw new Error("Distributor not deployed");
//     }

//     const { request } = await walletClient.simulateContract({
//         address: deployedDistributorAddress,
//         abi: DistributorAbi,
//         functionName: "distributeTokensEqually",
//         args: [tokenId],
//     })


//     await walletClient.writeContract(request)

//     return request
// }

export async function distributeTokenByUnit(tokenId: bigint) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await walletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "distributeTokensByUnit",
        args: [tokenId],
        account
    })


    await walletClient.writeContract(request)

    return request
}

export async function whitelistAddresses(addresses: string[]) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await walletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "whitelistAddresses",
        args: [addresses],
        account
    })


    await walletClient.writeContract(request)

    return request
}

export async function removeFromWhitelist(address: string) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await walletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "removeFromWhitelist",
        args: [address],
        account
    })


    await walletClient.writeContract(request)

    return request
}

export async function updateBaseFee(baseFee: bigint) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await walletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "updateBaseFee",
        args: [baseFee],
        account
    })


    await walletClient.writeContract(request)

    return request
}

export async function transferOwnership(newOwner: string) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await walletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "transferOwnership",
        args: [newOwner],
        account
    })

    await walletClient.writeContract(request)

    return request
}

export async function updateWhitelist(address: string) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await walletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "updateWhitelist",
        args: [address],
        account
    })

    await walletClient.writeContract(request)

    return request
}

export async function addTokenAddress(tokenAddress: string) {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const { request } = await walletClient.simulateContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "changeTokenAddress",
        args: [tokenAddress],
        account
    })

    await walletClient.writeContract(request)

    return request
}

export async function getBaseFee() {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const data = await walletClient.readContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "getBaseFee",
        args: [],
        account
    })

    return data
}

export async function getTokens() {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const data = await walletClient.readContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "getToken",
        args: [],
    })

    return data
}

export async function getWhitelistedAddresses() {
    if (!deployedDistributorAddress) {
        throw new Error("Distributor not deployed");
    }

    const data = await walletClient.readContract({
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

    const data = await walletClient.readContract({
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

    const data = await walletClient.readContract({
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

    const data = await walletClient.readContract({
        address: deployedDistributorAddress,
        abi: DistributorAbi,
        functionName: "registeredAddresses",
        args: [index],
    })

    return data
}

