"use client"
import Title from '~/components/title'
import styles from "~/components/dashboard.module.css"

export default function Page() {
  return (
    <div className={styles.intro}>
      <Title text="WALLETS" />
    </div>
  )
}
