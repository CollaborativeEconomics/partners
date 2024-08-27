import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import Script from 'next/script'
import Title from 'components/title'
import ButtonBlue from 'components/buttonblue'
import { getEventById } from 'utils/registry'
import { cleanAddress } from 'utils/address'
import styles from 'styles/dashboard.module.css'
import { BrowserQRCodeReader } from '@zxing/library';
import TextInput from 'components/form/textinput'
import { useAccount, useWriteContract } from 'wagmi'
import { readContract, switchChain, waitForTransaction } from '@wagmi/core'
import { arbitrumSepolia } from 'wagmi/chains'
import { config } from 'chains/config'
import { NFTAbi } from 'chains/contracts/volunteers/abis'
import { getContract } from 'utils/registry'

export async function getServerSideProps(context) {
  const id = context.query.id
  const event = await getEventById(id)
  return { props: { id, event} }
}

export default function Page({id, event}) {
  console.log('EVENT ID', id)
  const [device, setDevice] = useState(null)
  const [message, setMessage] = useState('Scan the QR-CODE to register for the event')
  const account = useAccount()
  const { data: hash, writeContract } = useWriteContract({ config});

  const { register, watch, setValue } = useForm({defaultValues: { address: '' }})
  const [address] = watch(['address'])

  console.log('Loading scanner')
  const qrReader = new BrowserQRCodeReader()
  console.log('QRCode reader initialized')

  qrReader.getVideoInputDevices().then((videoInputDevices) => {
    setDevice(videoInputDevices[0].deviceId)
  }).catch((err) => {
    console.error(err)
  })

  function decodeOnce() {
    qrReader.decodeFromInputVideoDevice(device, 'qrcode').then((result) => {
      console.log('Result', result)
      const address = result.getText()
      setMessage('Wallet '+address)
      setValue('address', address);
      const input = document.getElementById('address') as HTMLInputElement
      input.value = address
      // We got the wallet address
      // We may save the eventid, address and chain in volunteers table
    }).catch((err) => {
      console.error(err)
      setMessage(err)
    })
  }

  async function onScan() {
    console.log('Scanning device', device)
    setMessage('Scanning qrcode...')
    decodeOnce()
  }

  async function onStop() {
    console.log('Stopped')
    setMessage('Ready to scan')
    try {
      qrReader.reset()
    } catch(ex) {
      console.error(ex)
    }
  }


  async function onMint() {
    const nft: `0x${string}` = "0x950728DE32cC1bF223D3Fe51B0a44A4A1C868A72"
    console.log('account', account.address)
    // const contract = await getContract(`${id}`, "arbitrum", "testnet", "1155")
    // const nft = contract.address

    if (!account?.address || !nft) {
      console.error('User not connected or NFT contract not deployed');
      setMessage('Please Connect Wallet in Metamask');
      return;
    }

    console.log('account', account)

    if (account.chainId !== arbitrumSepolia.id) {
      await switchChain(config, {chainId: arbitrumSepolia.id})
    }

    console.log("address", address)
    const cleanedAddress = cleanAddress(address);
  
    try {
      // Check if user already has NFT with token ID 1
      const balance = await readContract(config, {
        address: nft,
        abi: NFTAbi,
        functionName: 'balanceOf',
        args: [cleanedAddress as `0x${string}`, BigInt(1)]
      });
  
      if (balance > BigInt(0)) {
        // throw new Error('User already registeredfor this event');
        setMessage('User already registered for this event');
        return;
      }
  
      // Mint new NFT for the user
      writeContract({
        address: nft,
        abi: NFTAbi,
        functionName: 'mint',
        args: [cleanedAddress as `0x${string}`, BigInt(1), BigInt(1)],
        chain: arbitrumSepolia,
        account: account.address
      });

      const nftReceipt = await waitForTransaction(config, {
        hash,
        confirmations: 2,
      })
  
      console.log('NFT minted successfully');
    } catch (error) {
      console.error('Registration error:', error);
    }
  }

  return (
    <div className='mt-8'>
      <div className={styles.mainBox}>
        <Title text="VOLUNTEER TO EARN" />
        <h1>{event.name}</h1>
        <div className="mt-8 w-[470px] h-[265px] border border-dashed">
          <video id="qrcode" width="470" height="265" className="w-[470px] h-[265px]"></video>
        </div>
        <div className="w-full mb-2 flex flex-row justify-between">
          <ButtonBlue id="buttonSubmit" text="SCAN" onClick={onScan} />
          <ButtonBlue id="buttonSubmit" text="STOP" onClick={onStop} />
        </div>
        <p id="message" className="mb-6 center">{message}</p>
        <div className="w-[90%] text-center">
          <p>Or copy/paste the address manually</p>
          <TextInput label="" id="address" className="text-center" register={register('address')} />
        </div>
        <div className="w-full mb-2 flex flex-row justify-between">
          <ButtonBlue id="buttonSubmit" text="MINT ATTENDANCE NFT" onClick={onMint} />
        </div>
      </div>
    </div>
  )
}
