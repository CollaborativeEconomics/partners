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
import LinkButton from 'components/linkbutton'
import Contract from 'components/contract'
import ContractCredits from 'components/contract-credits'
import styles from 'styles/dashboard.module.css'
import { getOrganizationById, getContractsByOrganization } from 'utils/registry'
import { ChainsList } from 'chains'

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
  //console.log('Org', organization)
  //console.log('Ctr', contracts)
  const orgid = organization?.id || ''
  const chains = ChainsList()
  const initialWallets = listWallets(initialChain, network)  
  const initialWallet = initialWallets[0]?.id
  const initialContract = 'Credits' // TODO: get from config
  const [wallets, setWallets] = useState(initialWallets)
  console.log('wallets', organization.wallets)
  console.log('wallet', initialWallet)
  console.log('contract', initialContract)


  function filterWallets(wallets, chain, network) {
    console.log(chain, network)
    const list = wallets?.filter(it=>it?.chain==chain)
    //const list = wallets?.filter(it=>(it?.chain==chain && it?.network==network))
    return list
  }

  function listWallets(chain, network) {
    const wallets = filterWallets(organization?.wallets, chain, network)
    const list = wallets?.map(it=>{ return {id:it.address, name:it.address} })
    return list
  }

  function listContracts() {
    return [
      //{ id: '721',     name: '721' },
      //{ id: '1155',    name: '1155' },
      { id: 'Credits', name: 'Credits' },
      { id: 'NFTReceipt', name: 'NFTReceipt' },
      //{ id: 'V2E',     name: 'V2E' },
    ]
  }

  function listChains() {
    const list = chains.map(it=>{ return { id: it, name: it } })
    return list
  }

  function listInitiatives() {
    const list = organization.initiative.map(it=>{ return { id: it.tag, name: it.title } })
    return list
  }

  const [ change, setChange ] = useState(0)
  const { register, watch } = useForm({
    defaultValues: {
      chain: initialChain,
      wallet: initialWallet,
      contract_type: initialContract
    }
  })
  const [
    chain,
    wallet,
    contract_type,
  ] = watch([
    'chain',
    'wallet',
    'contract_type',
  ])

  const url = `/dashboard/contract/${contract_type.toLowerCase()}?chain=${chain}&network=${network}&wallet=${wallet}&organizationId=${orgid}`
  console.log('URL', url)

  // Used to refresh list of wallets after new record added
  useEffect(()=>{
    console.log('Wallets changed!', change)
  },[change])

  function selectContract(contract){
    console.log('SEL', contract)
  }

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
              options={listWallets(chain, network)}
            />
            <Select
              label="Contract Type"
              register={register('contract_type')}
              options={listContracts()}
              onChange={selectContract}
            />
          </form>
        </div>

        <LinkButton href={url} className="mb-12" text="CLICK TO START" />
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
