/* TODO:
 - componentize each form by contract typr
 - return contract arguments from form input
*/

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { getToken } from 'next-auth/jwt'
import Dashboard from 'components/dashboard'
import Sidebar from 'components/sidebar'
import Title from 'components/title'
import Select from 'components/form/select'
import TextInput from 'components/form/textinput'
import ButtonBlue from 'components/buttonblue'
import Contract from 'components/contract'
import styles from 'styles/dashboard.module.css'
import { getOrganizationById, getContractsByOrganization } from 'utils/registry'
import Chains from 'chains'

type Dictionary = { [key:string]:any }

export async function getServerSideProps({req,res}) {
  const token:Dictionary = await getToken({ req })
  const orgid = token?.orgid || ''
  const organization = await getOrganizationById(orgid)
  const initialChain = 'Stellar' // TODO: Get from config
  const network = 'testnet' // TODO: Get from config
  const contracts = await getContractsByOrganization(orgid, initialChain, network)
  return { props: { organization, contracts, initialChain, network } }
}

export default function Page({organization, contracts, initialChain, network}) {
  console.log('Org', organization)
  //console.log('Ctr', contracts)
  const orgid = organization?.id || ''
  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 }
  const initialName = 'Credits Contract' // TODO: Get from dropdown first element
  const [contractName, setContractName] = useState(initialName)

  function setButtonState(state) {
    switch (state) {
      case ButtonState.READY:
        setButtonText('NEW CONTRACT')
        setButtonDisabled(false)
        break
      case ButtonState.WAIT:
        setButtonText('WAIT')
        setButtonDisabled(true)
        break
      case ButtonState.DONE:
        setButtonText('DONE')
        setButtonDisabled(true)
        break
    }
  }

  function filterWallets(wallets, chain, network) {
    console.log(chain, network)
    console.log(wallets)
    const list = wallets?.filter(it=>it?.chain==chain)
    //const list = wallets?.filter(it=>(it?.chain==chain && it?.network==network))
    return list
  }


  function listWallets() {
    const wallets = filterWallets(organization?.wallets, initialChain, network)
    console.log('WALLETS', wallets)
    const list = wallets.map(it=>{ return {id:it.address, name:it.address} })
    return list
  }

  function listContracts() {
    return [
      //{ id: '721',     name: '721' },
      //{ id: '1155',    name: '1155' },
      { id: 'Credits', name: 'Credits' },
      //{ id: 'V2E',     name: 'V2E' },
    ]
  }

  function argsForContract(type) {
    switch(type){
      case 'Credits': return [1,2,3]; break;
    }
    return null
  }

  function listChains() {
    return [
      //{ id: 'Arbitrum',   name: 'Arbitrum' },
      //{ id: 'Avalanche',   name: 'Avalanche' },
      //{ id: 'Base',        name: 'Base' },
      //{ id: 'Binance',     name: 'Binance' },
      //{ id: 'Celo',        name: 'Celo' },
      //{ id: 'EOS',         name: 'EOS' },
      //{ id: 'Ethereum',    name: 'Ethereum' },
      //{ id: 'Filecoin',    name: 'Filecoin' },
      //{ id: 'Flare',       name: 'Flare' },
      //{ id: 'Optimism',    name: 'Optimism' },
      //{ id: 'Polygon',     name: 'Polygon' },
      { id: 'Stellar',     name: 'Stellar' },
      { id: 'Starknet',    name: 'Starknet' },
      //{ id: 'XinFin',      name: 'XinFin' },
      //{ id: 'XRPL',        name: 'XRPL' }
    ]
  }

  function listInitiatives() {
    // TODO: get from org.initiatives
    return [
      {id: '123456-789012', name: 'Save the world'}
    ]
  }

  async function onSubmit(data) {
    console.log('SUBMIT', data)
    if (!data.chain) {
      showMessage('Chain is required')
      return
    }
    if (!data.wallet) {
      showMessage('Wallet is required')
      return
    }
    try {
      showMessage('Deploying contract...')
      setButtonState(ButtonState.WAIT)

      // DEPLOY
      // TODO: get args from form component
      const args = argsForContract(data.contract_type)
      console.log('ARGS', args)
      //console.log(Chains[data.chain])
      const ok = await Chains[data.chain]?.contracts[data.contract_type]?.deploy(args)
      console.log('OK', ok)
      if(!ok || ok?.error){
        showMessage('Error deploying contract: ' + (ok?.error||'Contract not found'))
        setButtonState(ButtonState.READY)
        return
      }
      showMessage('Contract deployed successfully')
      setButtonState(ButtonState.READY)
    } catch (ex) {
      console.error(ex)
      showMessage('Error deploying contract: ' + ex.message)
      setButtonState(ButtonState.READY)
    }
  }

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [buttonText, setButtonText] = useState('NEW CONTRACT')
  const [message, showMessage] = useState('Select chain, wallet and contract options')
  const [change, setChange] = useState(0)
  const { register, watch } = useForm({
    defaultValues: {
      chain: 'Stellar',
      wallet: '0x123',
      contract_type: 'Credits',
      vendor: '',
      vendor_fees: '90',
      provider: '',
      provider_fees: '10',
      minimum: '1',
      bucket: '20'
    }
  })
  const [
    chain,
    wallet,
    contract_type,
    vendor,
    vendor_fees,
    provider,
    provider_fees,
    minimum,
    bucket
  ] = watch([
    'chain',
    'wallet',
    'contract_type',
    'vendor',
    'vendor_fees',
    'provider',
    'provider_fees',
    'minimum',
    'bucket'
  ])

  // Used to refresh list of wallets after new record added
  useEffect(()=>{
    console.log('Wallets changed!', change)
  },[change])

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <Title text="Smart Contracts" />
        <div className={styles.mainBox}>
          <form className={styles.vbox}>
            <Select
              label="Chain"
              register={register('chain')}
              options={listChains()}
            />
            <Select
              label="Wallet"
              register={register('wallet')}
              options={listWallets()}
            />
            <Select
              label="Contract Type"
              register={register('contract_type')}
              options={listContracts()}
            />
          </form>
        </div>
        <div className={styles.mainBox}>
          <Title text={contractName} />
          <form className={styles.vbox}>
            {/* PAGER */}
            <div className="">
              {/* PAGE */}
              <div className="">
                <TextInput label="Credit Vendor (Wallet address)" register={register('vendor')} />
                <TextInput label="Vendor Fees (percentage)" register={register('vendor_fees')} />
                <TextInput label="Credit Provider (Wallet address)" register={register('provider')} />
                <TextInput label="Provider Fees (percentage)" register={register('provider_fees')} />
                <TextInput label="Bucket Size" register={register('bucket')} />
                <TextInput label="Minimum Donation" register={register('minimum')} />
              </div>
            </div>
          </form>
          <ButtonBlue
            id="buttonSubmit"
            text={buttonText}
            disabled={buttonDisabled}
            onClick={() =>
              onSubmit({
                chain,
                wallet,
                contract_type,
                vendor,
                vendor_fees,
                provider,
                provider_fees,
                minimum,
                bucket
              })
            }
          />
          <p id="message" className="text-center">
            {message}
          </p>
        </div>
        { contracts ? contracts.map((item) => (
          <div className={styles.mainBox} key={item.id}>
            <Contract key={item.id} {...item} />
          </div>
        )) : (
          <h1 className="text-center text-2xl my-24">No contracts found</h1>
        )}
      </div>
    </Dashboard>
  )
}
