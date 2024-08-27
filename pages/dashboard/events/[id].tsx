import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import Dashboard from 'components/dashboard'
import Sidebar from 'components/sidebar'
import Title from 'components/title'
import { Card, CardContent, CardHeader } from 'components/ui/card'
import { DateDisplay } from 'components/ui/date-posted'
import Gallery from 'components/ui/gallery'
import ShareModal from 'components/ShareModal'
import NotFound  from 'components/NotFound'
import OrganizationAvatar from 'components/organizationavatar'
import { getEventById, getVolunteersByEvent } from 'utils/registry'
import styles from 'styles/dashboard.module.css'
import ButtonBlue from 'components/buttonblue'
import LinkButton from 'components/linkbutton'
import { useConnect, useAccount, useWriteContract, useSimulateContract} from 'wagmi'
import { readContract, switchChain, waitForTransaction} from '@wagmi/core'
import { arbitrumSepolia } from 'wagmi/chains'
import { config } from 'chains/config'
import { FactoryAbi } from 'chains/contracts/volunteers/abis'
import { parseEther } from 'viem'
import { newContract } from 'utils/registry'
import { metaMask } from 'wagmi/connectors'
import { net } from 'web3'

export async function getServerSideProps(context) {
  const id = context.query.id
  const event = await getEventById(id)
  //const media = []
  const media = event.media?.map((it:any)=>it.media) || [] // flatten list
  media.unshift(event.image) // main image to the top
  const volunteers = await getVolunteersByEvent(id)
  return {
    props: { id, event, media, volunteers }
  }
}

export default function Event({id, event, media, volunteers}){
  console.log('EVENTID', id)
  console.log('VOLUNTEERS', volunteers.length)
  var total = 0
  let NFTAddress: `0x${string}`;
  let distributorAddress: `0x${string}`;
  const { connectors, connect, data: connection, isSuccess } = useConnect({ config })
  const { chainId, address } = useAccount()
  const { data: hash, writeContractAsync } = useWriteContract({ config});

  // State Variables
  const [ready, setReady] = useState(false)
  const [distributor, setDistributor] = useState(null)
  const [NFT, setNFT] = useState(null)

  function shortDate(d){
    const opt:Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: 'numeric',
      day: '2-digit'
    }
    const date = new Date(d).toLocaleDateString('en-CA')
    //const date = new Date(d).toLocaleDateString('en', opt)
    //const date = Intl.DateTimeFormat('jp-JP').format(new Date(d))
    return date
  }

  async function getEthEquivalentOfUsdc(usdcAmount: number): Promise<number> {
    try {
      // Fetch USDC/ETH price from CoinGecko
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=eth');
      const data = await response.json();
      
      // Extract the USDC/ETH exchange rate
      const usdcToEthRate = data['usd-coin'].eth;
      
      // Calculate ETH equivalent
      const ethAmount = usdcAmount * usdcToEthRate;
      
      return ethAmount;
    } catch (error) {
      console.error('Error fetching USDC/ETH price:', error);
      throw error;
    }
  }
  
  const FactoryAddress = "0xA14F3dD410021c7f05Ca1aEf7aDc9C86943E839f"
  const usdcAddressTestnet = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
  let NFTBlockNumber: number;
  let distributorBlockNumber: number;
  
    async function deployNFT() {
      try {
        console.log("Initiating NFT deployment...")
        const uri = "https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1.json"
         let data = await writeContractAsync({
          address: FactoryAddress,
          abi: FactoryAbi,
          functionName: "deployVolunteerNFT",
          args: [uri, address],
          chain: arbitrumSepolia,
          account: address
        })
  
        console.log("NFT deployment initiated. Waiting for confirmation...")
        // new Promise(resolve => setTimeout(resolve, 30000));
        const nftReceipt = await waitForTransaction(config, {
          hash: data,
          confirmations: 2,
        })
        console.log("NFT deployment confirmed. Receipt:", nftReceipt)
        NFTBlockNumber = nftReceipt.blockNumber
  
        const NFTAddress = await readContract(config, {
          address: FactoryAddress,
          abi: FactoryAbi,
          functionName: "getDeployedVolunteerNFT",
          args: [address]
        })
        console.log('NFTAddress:', NFTAddress)
        setNFT(NFTAddress)
  
        return NFTAddress
      } catch (error) {
        console.error("NFT deployment error:", error)
        throw error
      }
    }
  
    async function deployTokenDistributor(NFTAddress) {
      try {
        console.log("Initiating TokenDistributor deployment...")
        const ethAmount = await getEthEquivalentOfUsdc(event.unitvalue)
       let data = await writeContractAsync({
          address: FactoryAddress,
          abi: FactoryAbi,
          functionName: "deployTokenDistributor",
          args: [usdcAddressTestnet, NFTAddress as`0x${string}`, BigInt(event.unitvalue), parseEther(`${ethAmount}`)],
          chain: arbitrumSepolia,
          account: address
        })
  
        console.log("TokenDistributor deployment initiated. Waiting for confirmation...")
        const distributorReceipt = await waitForTransaction(config, {
          hash: data,
          confirmations: 2,
        })
        console.log("TokenDistributor deployment confirmed. Receipt:", distributorReceipt)
        distributorBlockNumber = distributorReceipt.blockNumber
  
        const distributorAddress = await readContract(config, {
          address: FactoryAddress,
          abi: FactoryAbi,
          functionName: "getDeployedTokenDistributor",
          args: [address]
        })
        console.log('distributorAddress:', distributorAddress)
  
        return distributorAddress
      } catch (error) {
        console.error("TokenDistributor deployment error:", error)
        throw error
      }
    }
  
    async function deploy() {
      try {
        if (chainId !== arbitrumSepolia.id) {
          await switchChain(config, {chainId: arbitrumSepolia.id})
        }
      } catch (error) {
        console.error('Error switching chain:', error)
        throw error
      }

      try {
        const NFTAddress = await deployNFT()
        const distributorAddress = await deployTokenDistributor(NFTAddress)
  
        console.log("Both deployments successful:", { NFTAddress, distributorAddress })

        const erc1155 = {
          chain: "arbitrum",
          contract_address: NFTAddress,
          entity_id: id as string,
          admin_wallet_address: address as string,
          contact_type: "1155",
          network: "testnet",
          start_block: NFTBlockNumber,
        }
        
       const info = await newContract(erc1155)
       console.log('INFO', info)

        const v2e = {
          chain: "arbitrum",
          contract_address: distributorAddress as string,
          entity_id: id as string,
          admin_wallet_address: address as string,
          contact_type: "V2E",
          network: "testnet",
          start_block: distributorBlockNumber,
        }
        const info2 = await newContract(v2e)
        console.log('INFO2', info2)
  
        setReady(true)
      } catch (error) {
        console.error("Deployment process failed:", error)
        throw error
      }
    }
  
  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <Title text="Volunteer To Earn Event" />
        <div className={styles.viewBox}>
          <DateDisplay timestamp={event.created} className="p-4" />
          <div className="p-4 mt-2">
            <Gallery images={media} />
          </div>
          <div className="flex flex-col pb-8 pt-3 gap-3 px-4">
            <h1 className="mt-4 text-4xl">{event.name}</h1>
            <p className="">{event.description}</p>
          </div>
          <div className="w-full p-4 mt-2">
            <h1 className="my-2">Volunteers</h1>
            <table className="w-full">
              <thead>
                <tr className="text-slate-400"><th align="left">Address</th><th align="right">Payment</th></tr>
              </thead>
              <tbody className="border-t-2">
              {volunteers?.map((item)=>{
                //console.log('ITEM')
                total += parseInt(item.amount)
                return (
                  <tr key={item.id}>
                    <td>{item.address.toLowerCase()}</td>
                    <td align="right">${item.amount}</td>
                  </tr>
                )
              })}
              </tbody>
              <tfoot className="border-t-2">
                <tr>
                  <td colSpan={2} align="right">Total ${total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="w-full flex flex-row justify-between mb-8">
            <ButtonBlue text="START EVENT" onClick={deploy}/>
          </div>
          <div className="w-full flex flex-row justify-between mb-8">
            <LinkButton href={`/dashboard/events/register/${id}`} text="REGISTER" />
            <LinkButton href={`/dashboard/events/report/${id}`} text="REPORT" />
            <LinkButton href={`/dashboard/events/reward/${id}`} text="REWARD" />
          </div>
        </div>
      </div>
    </Dashboard>
  )
}
