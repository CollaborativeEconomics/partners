import type { GetServerSidePropsContext } from "next"
import { useEffect, useState } from 'react'
import Console from '~/components/console'
import Title from '~/components/title'
import DonationsTable from '~/components/donationstable'
import TimeTab from '~/components/timetab'
import styles from "~/components/dashboard.module.css"

async function getDonations() {
  const orgid = '636283c22552948fa675473c'
  //const list = await apiFetch('donations?orgid='+orgid) ?? null
  //const url = '/api/donations?orgid='+orgid
  const url = 'http://localhost:3000/api/donations?orgid='+orgid
  const req = await fetch(url)
  const res = await req.json()
  const list = res.result || null
  //console.log('LIST', list)
  return list
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const data = await getDonations()
  return {props:{data}}
}

type Dictionary = { [key:string]:any }

interface Props {
  data?: Dictionary
}

export default function Test(props: Props) {
  //console.log('Props', props)

  async function byYear(){
    console.log('By Year')
  }
  async function byMonth(){
    console.log('By Month')
  }
  async function byWeek(){
    console.log('By Week')
  }

  const [data, setData] = useState(props.data)

  //useEffect(()=>{
  //  getDonations().then(res => setData(res))
  //}, [])

  return (
    <Console>
      <div className={styles.report}>
        <div className={styles.reportHead}>
          <Title>Donations</Title>
          {/*<TimeTab byYear={byYear} byMonth={byMonth} byWeek={byWeek} selected={1} />*/}
          <TimeTab />
        </div>
        <div className={styles.reportData}>
          <DonationsTable data={data} />
        </div>
      </div>
    </Console>
  )
}
