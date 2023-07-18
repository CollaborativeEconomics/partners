import { getToken } from 'next-auth/jwt'
import Image from 'next/image'
import Dashboard from 'components/dashboard'
import Sidebar from 'components/sidebar'
import Title from 'components/title'
import Initiative from 'components/initiative'
import ButtonBlue from 'components/buttonblue'
import styles from 'styles/dashboard.module.css'
import { getOrganizationById } from 'utils/registry'

type Dictionary = { [key:string]:any }

export async function getServerSideProps({req,res}) {
  const token:Dictionary = await getToken({ req })
  const orgid = token?.orgid || ''
  if(!orgid){
    return { props: { organization:null } }
  }
  const organization = await getOrganizationById(orgid)
  if(!organization){
    return { props: { organization:null } }
  }
  //const initiatives = await getInitiativesByOrganization(orgid) || null
  //console.log('org', organization)
  //console.log('ini', initiatives)
  return { props: { organization } }
}

export default function Page({organization}) {
  const initiatives = organization.initiative
  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <Title text="INITIATIVES" />
        <p className={styles.intro}>Creating an initiative allows donors to contribute to a specific campaign. This helps get your donors excited about the impact they can make, and helps them visualize how they’ll make the world a better place!</p>
        <div className={styles.mainBox}>
          <div className={styles.hbox}>
            <Image src="/media/upload.jpg" className="rounded-lg mr-6" width={200} height={200} alt="Upload a picture" />
            <div className={styles.vbox}>
              <div className={styles.vbox}>
                <label className={styles.inputLabel}>Title</label>
                <input type="text" className={styles.inputText} />
              </div>
              <div className={styles.vbox}>
                <label className={styles.inputLabel}>Description</label>
                <textarea className={styles.inputArea} />
              </div>
            </div>
          </div>
          <div className={styles.submitBox}>
            <ButtonBlue className={styles.submit} text="SUBMIT" />
          </div>
        </div>
        <div className={styles.mainBox}>
        { initiatives ? initiatives.map((item) => (
          <Initiative key={item.id} {...item} />
        )) : (
          <h1 className="text-center text-2xl my-24">No initiatives found</h1>
        )}
        </div>
      </div>
    </Dashboard>
  )
}
