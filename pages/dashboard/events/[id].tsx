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

  function shortDate(d){
    const opt:Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: 'numeric',
      day: '2-digit'
    }
    //const date = new Date(d).toLocaleDateString('en', opt)
    const date = new Date(d).toLocaleDateString('en-CA')
    //const date = Intl.DateTimeFormat('jp-JP').format(new Date(d))
    return date
  }

  function register(){
    console.log('REGISTER')
  }

  function reward(){
    console.log('REWARD')
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
          <div className="w-full flex flex-row justify-between">
            <Link href={`/register/${id}`}>REGISTER</Link>
            <ButtonBlue text="REWARD" onClick={reward}/>
          </div>
        </div>
      </div>
    </Dashboard>
  )
}
