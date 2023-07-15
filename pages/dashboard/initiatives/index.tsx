import { getToken } from 'next-auth/jwt'
import Dashboard from 'components/dashboard'
import Sidebar from 'components/sidebar'
import Title from 'components/title'
import styles from 'styles/dashboard.module.css'

type Dictionary = { [key:string]:any }

export async function getServerSideProps({req,res}) {
  const token:Dictionary = await getToken({ req })
  const orgid = token?.orgid || ''
  //const data = await getInitiatives(orgid)
  const data = []
  return { props: { data } }
}

export default function Page() {
  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.intro}>
          <Title text="INITIATIVES" />
        </div>
      </div>
    </Dashboard>
  )
}
