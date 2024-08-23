import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import Script from 'next/script'
import Title from 'components/title'
import ButtonBlue from 'components/buttonblue'
import { getEventById, getVolunteersByEvent } from 'utils/registry'
import styles from 'styles/dashboard.module.css'

export async function getServerSideProps(context) {
  const id = context.query.id
  const event = await getEventById(id)
  const volunteers = await getVolunteersByEvent(id)
  return { props: { id, event, volunteers } }
}

export default function Page({id, event, volunteers}) {
  console.log('EVENT ID', id)
  const [device, setDevice] = useState(null)
  const [message, setMessage] = useState('Start the disbursement process')
  const payrate = event?.payrate || 1
  const unitlabel = event?.unitlabel || ''
  var total = 0

  async function onMint() {
    console.log('MINT')
    // TODO: Lawal's magic goes here
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
