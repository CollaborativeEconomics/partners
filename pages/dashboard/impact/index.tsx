import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getToken } from 'next-auth/jwt'
import Dashboard from 'components/dashboard'
import Sidebar from 'components/sidebar'
import Title from 'components/title'
import Event from 'components/event'
import Label from 'components/form/label'
import TextInput from 'components/form/textinput'
import TextArea from 'components/form/textarea'
import FileView from 'components/form/fileview'
import Select from 'components/form/select'
import ButtonBlue from 'components/buttonblue'
import styles from 'styles/dashboard.module.css'
import { getOrganizationById, getEventsByOrganization } from 'utils/registry'
import { randomString, randomNumber } from 'utils/random'

type Dictionary = { [key:string]:any }

export async function getServerSideProps({req,res}) {
  const token:Dictionary = await getToken({ req })
  const orgid = token?.orgid || ''
  if(!orgid){
    return { props: { organization:null, providers:null } }
  }
  const organization = await getOrganizationById(orgid)
  if(!organization){
    return { props: { organization:null } }
  }
  console.log('OrgID', organization.id)
  //console.log('org', organization)
  const events = await getEventsByOrganization(orgid)
  return { props: { organization, events } }
}

export default function Page({organization, events}) {
  let initiatives = organization?.initiative || [{id:'0', title:'No initiatives'}]

  function listInitiatives() {
    if (!initiatives) {
      return [{ id: 0, name: 'No initiatives' }]
    }
    const list = []
    for (let i = 0; i < initiatives.length; i++) {
      list.push({ id: initiatives[i].id, name: initiatives[i].title })
    }
    return list
  }

  async function onSubmit(data) {
    console.log('SUBMIT', data)
  }

  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 }
  const imgSource = '/media/upload.jpg'  // noimage.png

  function setButtonState(state) {
    switch (state) {
      case ButtonState.READY:
        setButtonText('SUBMIT')
        setButtonDisabled(false)
        break
      case ButtonState.WAIT:
        setButtonText('WAIT')
        setButtonDisabled(true)
        break
      case ButtonState.DONE:
        setButtonText('DONE')
        setButtonDisabled(true)
        break
    }
  }

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [buttonText, setButtonText] = useState('SUBMIT')
  const [message, showMessage] = useState('Enter story info and upload image')
  const { register, watch } = useForm({
    defaultValues: {
      title: '',
      desc: '',
      initiativeId: initiatives[0].id,
      image: ''
    }
  })
  const [
    title,
    desc,
    initiativeId,
    image
  ] = watch([
    'title',
    'desc',
    'initiativeId',
    'image'
  ])


  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <Title text="Share a Story: Post an Impact NFT" />
        <p className={styles.intro}>Impact NFTs allow you to share your donors what their donations are contributing to. Tell a story that will attract new donations and make your donors feel good about supporting you!</p>
        <div className={styles.mainBox}>
          <form className={styles.vbox}>
            <FileView
              id="imgFile"
              register={register('image')}
              source={imgSource}
              width={250}
              height={250}
            />
            <Select
              label="Initiative"
              register={register('initiativeId')}
              options={listInitiatives()}
            />
            <TextInput label="Title" register={register('title')} />
            <TextArea label="Description" register={register('desc')} />
          </form>
          <ButtonBlue
            id="buttonSubmit"
            text={buttonText}
            disabled={buttonDisabled}
            onClick={() =>
              onSubmit({
                title,
                desc,
                initiativeId,
                image
              })
            }
          />
          <p id="message" className="text-center">
            {message}
          </p>
        </div>
        { events ? events.map((item) => (
          <div className={styles.mainBox} key={item.id}>
            <Event key={item.id} {...item} />
          </div>
        )) : (
          <h1 className="text-center text-2xl my-24">No events found</h1>
        )}
      </div>
    </Dashboard>
  )
}
