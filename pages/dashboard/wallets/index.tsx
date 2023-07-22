import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { getToken } from 'next-auth/jwt'
import Dashboard from 'components/dashboard'
import Sidebar from 'components/sidebar'
import Title from 'components/title'
import Select from 'components/form/select'
import TextInput from 'components/form/textinput'
import ButtonBlue from 'components/buttonblue'
import Wallet from 'components/wallet'
import styles from 'styles/dashboard.module.css'
import { getOrganizationById } from 'utils/registry'

type Dictionary = { [key:string]:any }

export async function getServerSideProps({req,res}) {
  const token:Dictionary = await getToken({ req })
  const orgid = token?.orgid || ''
  const organization = await getOrganizationById(orgid)
  return { props: { organization } }
}

export default function Page({organization}) {
  const orgid = organization.id || ''
  var wallets = organization.wallets || []
  
  function listChains() {
    return [
      { id: 'XRPL',     name: 'Ripple - XRPL' },
      { id: 'Stellar',  name: 'Stellar - XLM' },
      { id: 'Binance',  name: 'Binance - BNB' }
    ]
  }

  async function onSubmit(data) {
    console.log('SUBMIT', data)
    if (!data.chain) {
      showMessage('Chain is required')
      return
    }
    if (!data.address) {
      showMessage('Address is required')
      return
    }
    try {
      showMessage('Saving wallet to database...')
      setButtonState(ButtonState.WAIT)
      const opts = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf8' },
        body:JSON.stringify(data)
      }
      const saved = await fetch('/api/wallet?orgid='+orgid, opts)
      const result = await saved.json()
      if(result.success){
        wallets.push(result.data)
        setChange(change+1)
        showMessage('Wallet saved')
        setButtonState(ButtonState.DONE)
      } else {
        showMessage('Error saving wallet: ' + result.error)
        setButtonState(ButtonState.READY)
      }
    } catch (ex) {
      console.error(ex)
      showMessage('Error saving wallet: ' + ex.message)
      setButtonState(ButtonState.READY)
    }
  }

  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 }

  function setButtonState(state) {
    switch (state) {
      case ButtonState.READY:
        setButtonText('SUBMIT')
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

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [buttonText, setButtonText] = useState('NEW WALLET')
  const [message, showMessage] = useState('Select chain and enter wallet address')
  const [change, setChange] = useState(0)
  const { register, watch } = useForm({
    defaultValues: {
      chain: 'XRPL',
      address: ''
    }
  })
  const [
    chain,
    address
  ] = watch([
    'chain',
    'address'
  ])

  // Used to refresh list of wallets after new record added
  useEffect(()=>{
    console.log('Wallets changed!', change)
  },[change])

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <Title text="Wallets" />
        <p className={styles.intro}>Enter crypto wallets you’d like to accept donations through. Wallets connected to your account will be verified for approval</p>
        <div className={styles.mainBox}>
          <form className={styles.vbox}>
            <Select
              label="Chain"
              register={register('chain')}
              options={listChains()}
            />
            <TextInput label="Address" register={register('address')} />
          </form>
          <ButtonBlue
            id="buttonSubmit"
            text={buttonText}
            disabled={buttonDisabled}
            onClick={() =>
              onSubmit({
                chain,
                address
              })
            }
          />
          <p id="message" className="text-center">
            {message}
          </p>
        </div>
        { wallets ? wallets.map((item) => (
          <div className={styles.mainBox} key={item.id}>
            <Wallet key={item.id} {...item} />
          </div>
        )) : (
          <h1 className="text-center text-2xl my-24">No wallets found</h1>
        )}
      </div>
    </Dashboard>
  )
}
