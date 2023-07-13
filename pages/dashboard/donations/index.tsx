//import { useEffect, useState } from 'react'
import Dashboard from 'components/dashboard'
import Sidebar from 'components/sidebar'
import Title from 'components/title'
import DonationsTable from 'components/donationstable'
import TimeTab from 'components/timetab'
import styles from 'styles/dashboard.module.css'
import { apiFetch } from 'utils/api'

export async function getServerSideProps() {
  const data = await getDonations()
  return {props: { data }}
}

async function getDonations() {
  const orgid = '636283c22552948fa675473c'
  const data = await apiFetch('donations?orgid='+orgid) ?? null
  //console.log('DATA', data)
  if(!data || data.error){ return [] }
  return data?.result || []
}

type Dictionary = { [key:string]:any }

interface Props {
  data?: Array<Dictionary>;
}

export default function Page(props:Props) {
  const data: Dictionary = props.data || []
  const count = data?.length || 0
  let total = 0
  for(const i in data){ total += parseFloat(data[i].usdValue) }
  console.log('Count', count)
  console.log('Total', total)

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
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
      </div>
    </Dashboard>
  )
}
