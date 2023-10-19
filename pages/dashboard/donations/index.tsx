import { useState } from 'react'
import { getToken } from 'next-auth/jwt'
import { useSession } from 'next-auth/react'
import Dashboard from 'components/dashboard'
import Sidebar from 'components/sidebar'
import Title from 'components/title'
import DonationsTable from 'components/donationstable'
import TimeTab from 'components/timetab'
import styles from 'styles/dashboard.module.css'
import { apiFetch } from 'utils/api'

type Dictionary = { [key:string]:any }

export async function getServerSideProps({req,res}) {
  const token:Dictionary = await getToken({ req })
  const orgid = token?.orgid || ''
  //if(!orgid){ orgid = '636283c22552948fa675473c' }
  const data = await getDonations(orgid)
  return {props: { data }}
}

function firstDayOfYear() {
  const year = new Date().getFullYear()
  return new Date(year, 0, 1).toISOString().substr(0,10)
}

function firstDayOfMonth() {
  const year = new Date().getFullYear()
  const month = new Date().getMonth()
  return new Date(year, month, 1).toISOString().substr(0,10)
}

function firstDayOfWeek() {
  const now = new Date()
  now.setDate(now.getDate() - 7)
  return now.toISOString().substr(0,10)
}

function tomorrow() {
  const now = new Date()
  now.setDate(now.getDate() + 1) // tomorrow
  return now.toISOString().substr(0,10)
}

async function getDonations(orgid:string, from:string='', to:string='') {
  if(!from){ from = firstDayOfYear() }
  if(!to){ to = tomorrow() }
  console.log('Donations', orgid, from, to)
  const info = await apiFetch(`donations?orgid=${orgid}&from=${from}&to=${to}`) ?? null
  console.log('INFO', info.result.length)
  if(!info || info.error){
    return []
  }
  const data = info.result || []
  return data
}

interface Props {
  data?: Array<Dictionary>;
}

export default function Page(props:Props) {
  //console.log('PROPS', props)
  const { data: session } = useSession()
  const [data, setData] = useState(props.data)
  const orgid   = session?.orgid ?? ''
  //const orgname = session.orgname
  console.log('ORGID', orgid)
  //if(!orgid){ orgid = '636283c22552948fa675473c' }

  async function byYear() {
    const from = firstDayOfYear()
    const to   = tomorrow()
    const recs = await getDonations(orgid, from, to)
    setData(recs)
  }

  async function byMonth() {
    const from = firstDayOfMonth()
    const to   = tomorrow()
    const recs = await getDonations(orgid, from, to)
    setData(recs)
  }

  async function byWeek() {
    const from = firstDayOfWeek()
    const to   = tomorrow()
    const recs = await getDonations(orgid, from, to)
    setData(recs)
  }

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.report}>
          <div className={styles.reportHead}>
            <Title>Donations</Title>
            <TimeTab byYear={byYear} byMonth={byMonth} byWeek={byWeek} />
            {/*<TimeTab />*/}
          </div>
          <div className={styles.reportData}>
            <DonationsTable data={data} />
          </div>
        </div>
      </div>
    </Dashboard>
  )
}
