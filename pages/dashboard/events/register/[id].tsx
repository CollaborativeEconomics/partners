import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import Script from 'next/script'
import Title from 'components/title'
import ButtonBlue from 'components/buttonblue'
import { getEventById } from 'utils/registry'
import styles from 'styles/dashboard.module.css'
import { BrowserQRCodeReader } from '@zxing/library';
import TextInput from 'components/form/textinput'

export async function getServerSideProps(context) {
  const id = context.query.id
  const event = await getEventById(id)
  return { props: { id, event } }
}

export default function Page({id, event}) {
  console.log('EVENT ID', id)
  const [device, setDevice] = useState(null)
  const [message, setMessage] = useState('Scan the QR-CODE to register for the event')

  const { register, watch } = useForm({defaultValues: { address: '' }})
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
    console.log('MINT')
    // TODO: Lawal's magic goes here
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
