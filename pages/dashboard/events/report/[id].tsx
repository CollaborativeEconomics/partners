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
  const [message, setMessage] = useState('Scan the QR-CODE to report work delivered')
  const {register, watch} = useForm({defaultValues: { address: '', units: '' }})
  const [address, units] = watch(['address','units'])
  const payrate = event?.payrate || 1
  const unitlabel = event?.unitlabel || ''
  const [amount, setAmount] = useState(payrate)


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
      // TODO: Lawal's magic goes here
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

  function recalc(evt) {
    const value = evt.target.value || 1
    console.log('CALC', value)
    const total = value * payrate
    setAmount(total)
  }

  return (
    <div className='mt-8'>
      <div className={styles.mainBox}>
        <Title text="VOLUNTEER TO EARN" />
        <h1>{event.name}</h1>
        <div className="mt-8 w-[470px] h-[265px] border">
          <video id="qrcode" width="470" height="265" className="w-[470px] h-[265px]"></video>
        </div>
        <div className="w-full mb-2 flex flex-row justify-between">
          <ButtonBlue id="buttonSubmit" text="SCAN" onClick={onScan} />
          <ButtonBlue id="buttonSubmit" text="STOP" onClick={onStop} />
        </div>
        <p id="message" className="mb-6 center">{message}</p>
        <div id="form" className="w-[90%]">
          <TextInput label="Wallet address" id="address" className="text-center" register={register('address')} />
          <TextInput label="Units delivered" register={register('units')} onChange={(evt)=>recalc(evt)}/>
          <div className="text-center">
            <p>Estimated reward based on units delivered</p>
            <p>{payrate} USD per unit ({unitlabel})</p>
            <p><big><b>Total of {amount} USD</b></big></p>
          </div>
        </div>
        <div className="w-full mb-2 flex flex-row justify-between">
          <ButtonBlue id="buttonSubmit" text="MINT REPORT NFT" onClick={onMint} />
        </div>
      </div>
    </div>
  )
}
