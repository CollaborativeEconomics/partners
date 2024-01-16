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
//import { getOrganizationById, getStoriesByOrganization } from 'utils/registry'
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
  const events = await getStoriesByOrganization(orgid)
  return { props: { organization, events } }
}
*/

function getExtension(mime){
  let ext = ''
  switch (mime) {
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
  return ext
}

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
      const ini = org?.initiative || []
      const iid = org?.initiative?.length > 0 ? org?.initiative[0].id : ''
      const evt = await apiFetch('stories?id='+oid) || []
      console.log('ORG:', org)
      console.log('INI:', ini)
      console.log('IID:', iid)
      console.log('EVT:', evt)
      setOrgid(oid)
      setInitId(iid)
      setInitiatives(ini)
      setEvents(evt)
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
    if(!data?.file){ return {error:'no image provided'} }
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
    console.log('INITID', initId)
    //return
    // Validate data
    if (!data.name) {
      showMessage('Title is required')
      return
    }
    if (!data.desc) {
      showMessage('Description is required')
      return
    }
    if (!data.image1){
      showMessage('Image is required')
      return
    }
    if (!data.initiativeId){
      showMessage('Initiative is required')
      return
    }
    const file1 = data.image1[0]
    const file2 = data.image2 ? data.image2[0] : null
    const file3 = data.image3 ? data.image3[0] : null
    const file4 = data.image4 ? data.image4[0] : null
    const file5 = data.image5 ? data.image5[0] : null
    let ext1 = getExtension(file1?.type)
    let ext2 = getExtension(file2?.type)
    let ext3 = getExtension(file3?.type)
    let ext4 = getExtension(file4?.type)
    let ext5 = getExtension(file5?.type)
    if (file1 && !ext1) { showMessage('Only JPG, PNG and WEBP images are allowed'); return }
    if (file2 && !ext2) { showMessage('Only JPG, PNG and WEBP images are allowed'); return }
    if (file3 && !ext3) { showMessage('Only JPG, PNG and WEBP images are allowed'); return }
    if (file4 && !ext4) { showMessage('Only JPG, PNG and WEBP images are allowed'); return }
    if (file5 && !ext5) { showMessage('Only JPG, PNG and WEBP images are allowed'); return }
    
    const imgName = randomString()
    const image1 = { name: imgName+'1' + ext1, file: file1 }
    const image2 = { name: imgName+'2' + ext2, file: file2 }
    const image3 = { name: imgName+'3' + ext3, file: file3 }
    const image4 = { name: imgName+'4' + ext4, file: file4 }
    const image5 = { name: imgName+'5' + ext5, file: file5 }

    const record = {
      created: dateToPrisma(new Date()),
      name: data.name,
      description: data.desc,
      amount: 0,
      image: '',
      organizationId: orgid,
      initiativeId: data.initiativeId
    }
    try {
      showMessage('Saving image...')
      setButtonState(ButtonState.WAIT)
      const resimg1 = await saveImage(image1)
      const resimg2 = await saveImage(image2)
      const resimg3 = await saveImage(image3)
      const resimg4 = await saveImage(image4)
      const resimg5 = await saveImage(image5)
      console.log('RESIMG1', resimg1)
      console.log('RESIMG2', resimg2)
      console.log('RESIMG3', resimg3)
      console.log('RESIMG4', resimg4)
      console.log('RESIMG5', resimg5)
      if (resimg1.error) {
        showMessage('Error saving image: ' + resimg1.error)
        setButtonState(ButtonState.READY)
        return
      }
      if (typeof resimg1?.uri === "string") { record.image = resimg1.uri } // Main image
      const storypics = [] // more images to storypics table
      if (typeof resimg2?.uri === "string") { storypics.push(resimg2.uri) }
      if (typeof resimg3?.uri === "string") { storypics.push(resimg3.uri) }
      if (typeof resimg4?.uri === "string") { storypics.push(resimg4.uri) }
      if (typeof resimg5?.uri === "string") { storypics.push(resimg5.uri) }
      console.log('REC', record)
      console.log('PIX', storypics)
      showMessage('Saving info to database...')
      const opts1 = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf8' },
        body: JSON.stringify(record)
      }
      const resp1 = await fetch('/api/story', opts1)
      const result1 = await resp1.json()
      console.log('RESULT1', result1)
      if (result1.error) {
        showMessage('Error saving event: ' + result1.error)
        setButtonState(ButtonState.READY)
      } else if (typeof result1?.success == 'boolean' && !result1.success) {
        showMessage('Error saving event: unknown')
        setButtonState(ButtonState.READY)
      } else {
        const storyid = result1.data.id
        const opts2 = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf8' },
          body: JSON.stringify({images:storypics})
        }
        const resp2 = await fetch('/api/storypics?id='+storyid, opts2)
        const result2 = await resp2.json()
        console.log('RESULT2', result2)
        events.push(result1.data)
        setChange(change+1)
        showMessage('Event info saved')
        if(data.yesNFT){
          showMessage('Event info saved, minting NFT...')
          const eventid = result1.data.id
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

  const iid = initiatives?.length>0 ? initiatives[0].id : ''
  const [initId, setInitId] = useState(iid)
  console.log('INITID:', initId)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [buttonText, setButtonText] = useState('SUBMIT')
  const [message, showMessage] = useState('Enter story info and upload image')
  const [change, setChange] = useState(0)
  const { register, watch } = useForm({
    defaultValues: {
      initiativeId: '',
      name: '',
      desc: '',
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      image5: '',
      yesNFT: true
    }
  })
  const [
    initiativeId,
    name,
    desc,
    image1,
    image2,
    image3,
    image4,
    image5,
    yesNFT
  ] = watch([
    'initiativeId',
    'name',
    'desc',
    'image1',
    'image2',
    'image3',
    'image4',
    'image5',
    'yesNFT'
  ])

  // Used to refresh list of events after new record added
  useEffect(()=>{
    console.log('Events changed!', change)
  },[change])

  async function onOrgChange(id) {
    console.log('ORG CHANGED', orgid, 'to', id)
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
              id="image1"
              register={register('image1')}
              source={imgSource}
              width={250}
              height={250}
            />
            <div className={styles.hbox + ' justify-center'}>
              <FileView
                id="image2"
                register={register('image2')}
                source={imgSource}
                width={128}
                height={128}
              />
              <FileView
                id="image3"
                register={register('image3')}
                source={imgSource}
                width={128}
                height={128}
              />
              <FileView
                id="image4"
                register={register('image4')}
                source={imgSource}
                width={128}
                height={128}
              />
              <FileView
                id="image5"
                register={register('image5')}
                source={imgSource}
                width={128}
                height={128}
              />
            </div>
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
                image1,
                image2,
                image3,
                image4,
                image5,
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
