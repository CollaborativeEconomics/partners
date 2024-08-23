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
import { deployDistributor } from 'utils/blockchain/deployTokenDistributor'
import { Connector, useConnect, useAccount, useWriteContract, useWatchContractEvent } from 'wagmi'
import { readContract, watchContractEvent } from '@wagmi/core'
import { arbitrumSepolia } from 'wagmi/chains'
import { config } from 'chains/config'
import { FactoryAbi, NFTAbi, DistributorAbi } from 'chains/contracts/volunteers/abis'
import { parseEther } from 'viem'

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
  const { connectors, connect } = useConnect()
  const { address } = useAccount()
  const { data: hash, writeContract } = useWriteContract({ config});

  // State Variables
  const [ready, setReady] = useState(false)
  const [distributor, setDistributor] = useState(null)
  const [NFT, setNFT] = useState(null)
  const [isClient, setIsClient] = useState(false)
  const [mintedAddresses, setMintedAddresses] = useState<`0x${string}`[]>([])

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  async function deploy(){
    const FactoryAddress = "0xA14F3dD410021c7f05Ca1aEf7aDc9C86943E839f";
    const usdcAddressMainnet = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
    const usdcAddressTestnet = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";
    const account = address;
    connectors.map((connector) => connect({connector}))
      try {
        const uri = "https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1.json";
        writeContract({
            address: FactoryAddress,
            abi: FactoryAbi,
            functionName: "deployVolunteerNFT",
            args: [uri, address],
            chain: arbitrumSepolia,
            account
        })
      } catch (error) {
          console.error("Deployment error:", error);
      }
      NFTAddress = await readContract(config, {
        address: FactoryAddress,
        abi: FactoryAbi,
        functionName: "getDeployedVolunteerNFT",
        args: [address]
      })

      setNFT(NFTAddress)

      const ethAmount = await getEthEquivalentOfUsdc(5);

      try {
        const account = address;
        writeContract({
            address: FactoryAddress,
            abi: FactoryAbi,
            functionName: "deployTokenDistributor",
            args: [usdcAddressTestnet, NFT, BigInt(5), parseEther(`${ethAmount}`)],
            chain: arbitrumSepolia,
            account
        })
      } catch (error) {
          console.error("Deployment error:", error);
      }

      distributorAddress = await readContract(config, {
        address: FactoryAddress,
        abi: FactoryAbi,
        functionName: "getDeployedTokenDistributor",
        args: [address]
      })

      setDistributor(distributorAddress)

      setReady(true);
    }

    async function register() {
      if (!address || !NFT) {
        console.error('User not connected or NFT contract not deployed');
        return;
      }
    
      try {
        // Check if user already has NFT with token ID 1
        const balance = await readContract(config, {
          address: NFT as `0x${string}`,
          abi: NFTAbi,
          functionName: 'balanceOf',
          args: [address, BigInt(1)]
        });
    
        if (balance > BigInt(0)) {
          throw new Error('User already has an NFT for this event');
        }
    
        // Mint new NFT for the user
        writeContract({
          address: NFT as `0x${string}`,
          abi: NFTAbi,
          functionName: 'mint',
          args: [address, BigInt(1), BigInt(1)],
          chain: arbitrumSepolia,
          account: address
        });
    
        console.log('NFT minted successfully');
      } catch (error) {
        console.error('Registration error:', error);
      }
    }

    async function report() {
      if (!address || !NFT) {
        console.error('User not connected or NFT contract not deployed');
        return;
      }
    
      try {
        // Check if user has NFT with token ID 1
        const balance = await readContract(config, {
          address: NFT as `0x${string}`,
          abi: NFTAbi,
          functionName: 'balanceOf',
          args: [address, BigInt(1)]
        });
    
        if (balance === BigInt(0)) {
          throw new Error('Not yet registered');
        }

            // Set up event listener for TransferSingle event
    const unwatch = watchContractEvent(config, 
      {
        address: NFT as `0x${string}`,
        abi: NFTAbi,
        eventName: 'TransferSingle',
        onLogs(logs) { 
          logs.forEach(log => {
            const { args } = log;
            if (args.id === BigInt(2)) {
              console.log(`Token ID 2 minted to address: ${args.to}`);
              setMintedAddresses(prev => [...prev, args.to]);
            }
          });
          console.log('Logs changed!', logs) 
        }, 
      });
      unwatch()
    
        // Mint token ID 2 for the user
        writeContract({
          address: NFT as `0x${string}`,
          abi: NFTAbi,
          functionName: 'mint',
          args: [address, BigInt(2), BigInt(1)],
          chain: arbitrumSepolia,
          account: address
        });
    
        console.log('Reward NFT (token ID 2) minted successfully');
      } catch (error) {
        console.error('Reward error:', error);
      }
    }
  
    async function reward() {
      if (!address || !distributor) {
        console.error('User not connected or Distributor contract not deployed');
        return;
      }
    
      try {
        // Create a dummy address array
        const dummyAddresses: `0x${string}`[] = [
          '0x1234567890123456789012345678901234567890',
          '0x2345678901234567890123456789012345678901',
          '0x3456789012345678901234567890123456789012'
        ];
    
        // Call distributeTokensByUnit function
        writeContract({
          address: distributor as `0x${string}`,
          abi: DistributorAbi,
          functionName: 'distributeTokensByUnit',
          args: [dummyAddresses], // mintedAddress
          chain: arbitrumSepolia,
          account: address
        });
    
        console.log('Tokens distributed successfully');
      } catch (error) {
        console.error('Reward distribution error:', error);
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
