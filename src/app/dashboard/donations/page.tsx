//import { useEffect, useState } from 'react'
import Title from '~/components/title'
import DonationsTable from '~/components/donationstable'
import TimeTab from '~/components/timetab'
import styles from "~/components/dashboard.module.css"
//import { apiFetch } from '~/utils/api'

export default async function Page() {
  async function getDonations() {
    const orgid = '636283c22552948fa675473c'
    //const list = await apiFetch('donations?orgid='+orgid) ?? null
    //const url = '/api/donations?orgid='+orgid
    const url = 'http://localhost:3000/api/donations?orgid='+orgid
    const req = await fetch(url)
    const res = await req.json()
    const list = res.result
    //console.log('LIST', list)
    return list
  }

/* CLIENT
  const [donations, setDonations] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(()=>{
    getDonations().then(data=>{
      setDonations(data)
      console.log('GetDonations', data.length)
    })
  }, [])
*/

  const data = await getDonations()
  const count = data?.length || 0
  let total = 0
  for(const i in data){ total += parseFloat(data[i].usdValue) }
  //console.log('DATA', data)
  console.log('Count', count)
  console.log('Total', total)

  return (
    <>
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
    </>
  )
}
