import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
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
import Checkbox from 'components/form/checkbox'
import ButtonBlue from 'components/buttonblue'
import styles from 'styles/dashboard.module.css'
//import { getOrganizationById, getEventsByOrganization } from 'utils/registry'
import { randomString, randomNumber } from 'utils/random'
import dateToPrisma from 'utils/dateToPrisma'
import { apiFetch } from 'utils/api'

type Dictionary = { [key:string]:any }
/*
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
*/

//export default function Page({organization, events}) {
export default function Page() {
  //const orgid = organization?.id || ''
  //const initiatives = organization?.initiative || [{id:'0', title:'No initiatives'}]
  const { data: session, update } = useSession()
  const [orgid, setOrgid] = useState(session?.orgid || '')
  const [initiatives, setInitiatives] = useState([])
  const [events, setEvents] = useState([])

  useEffect(()=>{
    async function loadData(){
      const oid = session?.orgid ?? ''
      const org = await apiFetch('organization?id='+oid) || {}
      console.log('ORG:', org)
      const evt = await apiFetch('events?id='+oid) || []
      console.log('EVT:', evt)
      setOrgid(oid)
      setInitiatives(org?.initiative || [])
      setEvents(evt || [])
    }
    loadData()
  },[update])

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

  async function saveImage(data) {
    console.log('IMAGE', data)
    const body = new FormData()
    body.append('name', data.name)
    body.append('file', data.file)
    const resp = await fetch('/api/ipfs', { method: 'POST', body })
    const result = await resp.json()
    return result
  }

  function clearForm() {
    setButtonState(ButtonState.READY)
    showMessage('Enter story info and upload image')
  }

  async function onSubmit(data) {
    if(buttonText=='DONE'){
      clearForm()
      return
    }
    console.log('SUBMIT', data)
    // Validate data
    if (!data.name) {
      showMessage('Title is required')
      return
    }
    if (!data.desc) {
      showMessage('Description is required')
      return
    }
    if (!data.image){
      showMessage('Image is required')
      return
    }
    const file = data.image[0]
    let ext = ''
    switch (file.type) {
      case 'image/jpg':
      case 'image/jpeg':
        ext = '.jpg'
        break
      case 'image/png':
        ext = '.png'
        break
      case 'image/webp':
        ext = '.webp'
        break
    }
    if (!ext) {
      showMessage('Only JPG, PNG and WEBP images are allowed')
      return
    }
    const image = {
      name: randomString() + ext,
      file: file
    }
    const record = {
      created: dateToPrisma(new Date()),
      name: data.name,
      description: data.desc,
      amount: 0,
      image: '',
      organizationId: orgid,
      initiativeId: initiativeId
    }
    try {
      showMessage('Saving image...')
      setButtonState(ButtonState.WAIT)
      const resimg = await saveImage(image)
      console.log('RESIMG', resimg)
      if (resimg.error) {
        showMessage('Error saving image: ' + resimg.error)
        setButtonState(ButtonState.READY)
        return
      }
      if (typeof resimg?.uri === "string") {
        record.image = resimg.uri
      }
      console.log('REC', record)
      showMessage('Saving info to database...')
      const opts = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf8' },
        body:JSON.stringify(record)
      }
      const resp = await fetch('/api/event', opts)
      const result = await resp.json()
      console.log('RESULT', result)
      if (result.error) {
        showMessage('Error saving event: ' + result.error)
        setButtonState(ButtonState.READY)
      } else if (typeof result?.success == 'boolean' && !result.success) {
        showMessage('Error saving event: unknown')
        setButtonState(ButtonState.READY)
      } else {
        events.push(result.data)
        setChange(change+1)
        showMessage('Event info saved')
        if(data.yesNFT){
          showMessage('Event info saved, minting NFT...')
          const eventid = result.data.id
          console.log('Minting NFT for event', eventid)
          const resMint = await fetch('/api/mint?eventid='+eventid)
          const okNft = await resMint.json()
          console.log('RESULT', okNft)
          if(okNft?.error){
            showMessage('Event saved, error minting NFT')
          } else {
            showMessage('Event saved, NFT minted')
          }
        }
        setButtonState(ButtonState.DONE)
      }
    } catch (ex) {
      console.error(ex)
      showMessage('Error saving event: ' + ex.message)
      setButtonState(ButtonState.READY)
    }
  }

  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 }
  const imgSource = '/media/upload.jpg'

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
        setButtonDisabled(false)
        break
    }
  }

  const initId = initiatives?.length>0 ? initiatives[0].id : ''
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [buttonText, setButtonText] = useState('SUBMIT')
  const [message, showMessage] = useState('Enter story info and upload image')
  const [change, setChange] = useState(0)
  const { register, watch } = useForm({
    defaultValues: {
      initiativeId: initId,
      name: '',
      desc: '',
      image: '',
      yesNFT: true
    }
  })
  const [
    initiativeId,
    name,
    desc,
    image,
    yesNFT
  ] = watch([
    'initiativeId',
    'name',
    'desc',
    'image',
    'yesNFT'
  ])

  // Used to refresh list of events after new record added
  useEffect(()=>{
    console.log('Events changed!', change)
  },[change])

  async function onOrgChange(id) {
    console.log('ORG CHAGED', orgid, 'to', id)
  }

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
            <TextInput label="Title" register={register('name')} />
            <TextArea label="Description" register={register('desc')} />
            <Checkbox label="Mint Impact NFT" register={register('yesNFT')} check={true} />
          </form>
          <ButtonBlue
            id="buttonSubmit"
            text={buttonText}
            disabled={buttonDisabled}
            onClick={() =>
              onSubmit({
                initiativeId,
                name,
                desc,
                image,
                yesNFT
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
