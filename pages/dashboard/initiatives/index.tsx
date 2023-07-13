import Dashboard from 'components/dashboard'
import Sidebar from 'components/sidebar'
import Title from 'components/title'
import styles from 'styles/dashboard.module.css'

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
