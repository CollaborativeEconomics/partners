import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import Script from 'next/script'
import Title from 'components/title'
import ButtonBlue from 'components/buttonblue'
import { getEventById, getVolunteersByEvent } from 'utils/registry'
import styles from 'styles/dashboard.module.css'
import { Connector, useConnect, useAccount, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { arbitrumSepolia } from 'wagmi/chains'
import { config } from 'chains/config'
import { DistributorAbi } from 'chains/contracts/volunteers/abis'
import { getReportedAddresses } from 'chains/logs'
import { getContract } from 'utils/registry'

export async function getServerSideProps(context) {
  const id = context.query.id
  const event = await getEventById(id)
  const volunteers = await getVolunteersByEvent(id)
  const nft = context.query.nft as `0x${string}`
  const account = context.query.account as string
  const mintedAddresses = context.query.mintedAddresses as `0x${string}`[]
  return { props: { id, event, volunteers, account, mintedAddresses } }
}

export default function Page({id, event, volunteers, account, mintedAddresses}) {
  console.log('EVENT ID', id)
  const [device, setDevice] = useState(null)
  const [message, setMessage] = useState('Start the disbursement process')
  const { data: hash, writeContract } = useWriteContract({ config});
  const { connectors, connect } = useConnect()
  const payrate = event?.payrate || 1
  const unitlabel = event?.unitlabel || ''
  var total = 0

  async function onMint() {
    const distributor: `0x${string}` = "0xE9E27A9Ca49d285611949260e05CB82b5989eCEC"
    const nft: `0x${string}` = "0x950728DE32cC1bF223D3Fe51B0a44A4A1C868A72"
    // const contract = await getContract(`${id}`, "arbitrum", "testnet", "V2E")
    // const distributor = contract.address
    // const nftContract = await getContract(`${id}`, "arbitrum", "testnet", "1155")
    // const nft = nftContract.address
    // const block = nftContract.block

    // const volunteers = await getReportedAddresses(nft, block)
    if (!account || !distributor) {
      console.error('User not connected or Distributor contract not deployed');
      setMessage('User not connected or Distributor contract not deployed');
      return;
    }
  
    try {
      // Call distributeTokensByUnit function
      writeContract({
        address: distributor as `0x${string}`,
        abi: DistributorAbi,
        functionName: 'distributeTokensByUnit',
        args: [volunteers.data],
        chain: arbitrumSepolia,
        account: account
      });

      const distributionReceipt = await waitForTransactionReceipt(config, {
        hash,
        confirmations: 2
      })
  
      console.log('Tokens distributed successfully');
      setMessage('Tokens distributed successfully');
    } catch (error) {
      console.error('Reward distribution error:', error);
    }
  }

  return (
    <div className='mt-8'>
      <div className={styles.mainBox}>
        <Title text="VOLUNTEER TO EARN" />
        <h1>{event.name}</h1>
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
        <div className="w-full mb-2 flex flex-row justify-between">
          <ButtonBlue id="buttonSubmit" text="REWARD VOLUNTEERS" onClick={onMint} />
        </div>
        <p id="message" className="mb-6 center">{message}</p>
      </div>
    </div>
  )
}
