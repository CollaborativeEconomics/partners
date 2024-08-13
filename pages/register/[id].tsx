import Image from 'next/image'
import Title from 'components/title'
import ButtonBlue from 'components/buttonblue'
import { getEventById } from 'utils/registry'
import styles from 'styles/dashboard.module.css'


export async function getServerSideProps(context) {
  const id = context.query.id
  const event = await getEventById(id)
  return { props: { id, event } }
}

export default function Page({id, event}) {
  console.log('EVENT ID', id)
  const message = 'Sign a transaction with your wallet'

  async function onSubmit(data) {
    console.log('SUBMIT', data)
  }

  return (
    <main className={styles.content}>
      <div className={styles.mainBox}>
        <Title text="VOLUNTEER TO EARN" />
        <p className="">Register for the event and get rewarded in cash</p>
        <div className="mt-8">
          <Image src={event.image} width={300} height={150} alt="Event image" className="mb-6" />
          <h1>{event.name}</h1>
          <p>{event.description}</p>
        </div>
        <div className="mb-8">
          <ButtonBlue id="buttonSubmit" text="REGISTER" onClick={onSubmit} />
          <p id="message" className="text-center">{message}</p>
        </div>
      </div>
    </main>
  )
}
