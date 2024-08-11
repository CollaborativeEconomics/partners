import { NextApiRequest, NextApiResponse } from 'next'
import Xinfin from 'chains/xinfin'
import ipfsUpload from 'utils/upload-ipfs'
import { getStoryById, updateStory, getEventById } from 'utils/registry'

interface Info {
  success?: boolean
  image?: string
  metadata?: string
  tokenId?: string
  error?: string
}

export default async function Mint(req: NextApiRequest, res: NextApiResponse) {
  console.log('API MINTING NFT1155...')
  const {storyid, eventid} = req.query
  console.log('STORY', storyid)
  console.log('EVENT', eventid)

  if(storyid){
    const info:Info = await mintStory(storyid)
    if(info.error){ 
      return res.status(500).json({ success: false, error: info.error })
    }
    return res.status(200).json(info)
  } else if(eventid) {
    const info:Info = await mintEvent(eventid)
    if(info.error){ 
      return res.status(500).json({ success: false, error: info.error })
    }
    return res.status(200).json(info)
  } else {
    return res.status(500).json({ error: 'Story or event id required' })
  }
}

async function mintStory(storyid){
  try {
    // Form data
    const created = new Date().toJSON().replace('T', ' ').substring(0, 19)

    // Get story info
    let story = await getStoryById(storyid.toString())
    console.log('STORY', story)
    if(!story) {
      return { error: 'Story not found' }
    }

    // Save metadata
    const metadata = {
      mintedBy: 'CFCE via Give',
      title: 'Story NFT',
      created: created,
      organization: story.organization?.name,
      initiative: story.initiative?.title,
      story: story.name,
      description: story.description,
      image: story.image
    }

    console.log('META', metadata)
    const fileId = 'story-' + story.id // unique file id
    const bytes = Buffer.from(JSON.stringify(metadata, null, 2))
    const cidMeta = await ipfsUpload(fileId, bytes, 'text/plain')
    console.log('CID', cidMeta)
    if (!cidMeta || cidMeta.error) {
      return { error: 'Error uploading metadata' }
    }
    const cid = cidMeta?.cid
    const uriMeta = 'ipfs:' + cid
    //const uriMeta = cidMeta?.url
    console.log('URI', uriMeta)

    // Mint NFT
    const contract = process.env.XINFIN_NFT1155_CONTRACT
    const address = process.env.XINFIN_MINTER_WALLET // Minter gets all story nfts
    const tokenId = '0x'+story.id.replaceAll('-','')
    const okMint = await Xinfin.mintNFT1155(contract, address, tokenId, uriMeta)
    console.log('Mint result', okMint)
    if (!okMint || okMint?.error) {
      return { error: 'Error minting NFT' }
    }

    // Update Story to Prisma
    const data = {
      tokenId: tokenId,
      metadata: uriMeta
    }
    console.log('Story', data)
    const saved = await updateStory(story.id, data)
    console.log('Saved', saved?.success)
    if (saved.success) {
      console.log('Story saved in DB!')
    } else {
      console.error('Error updating story in DB!')
    }

    // Success
    const info = {
      success: true,
      image: story.image,
      metadata: uriMeta,
      tokenId: okMint.tokenId
    }
    console.log('RESULT', info)
    console.log('Minting completed')
    return info
  } catch (ex) {
    console.error(ex)
    return { error: ex.message }
  }
}


async function mintEvent(eventid){
  try {
    // Form data
    const created = new Date().toJSON().replace('T', ' ').substring(0, 19)

    // Get event info
    let event = await getEventById(eventid.toString())
    console.log('Event', event)
    if(!event) {
      return { error: 'Event not found' }
    }

    // Save metadata
    const metadata = {
      mintedBy: 'CFCE via Give',
      title: 'Event NFT',
      created: created,
      organization: event.organization?.name || '?',
      initiative: event.initiative?.title || '?',
      event: event.name,
      description: event.description,
      image: event.image
    }

    console.log('META', metadata)
    const fileId = 'event-' + event.id // unique file id
    const bytes = Buffer.from(JSON.stringify(metadata, null, 2))
    const cidMeta = await ipfsUpload(fileId, bytes, 'text/plain')
    console.log('CID', cidMeta)
    if (!cidMeta || cidMeta.error) {
      return { error: 'Error uploading metadata' }
    }
    const cid = cidMeta?.cid
    const uriMeta = 'ipfs:' + cid
    //const uriMeta = cidMeta?.url
    console.log('URI', uriMeta)

    // Mint NFT
    const contract = process.env.XINFIN_NFT1155_CONTRACT
    const address = process.env.XINFIN_MINTER_WALLET // Minter gets all event nfts
    const tokenId = '0x'+event.id.replaceAll('-','')
    const okMint = await Xinfin.mintNFT1155(contract, address, tokenId, uriMeta)
    console.log('Mint result', okMint)
    if (!okMint || okMint?.error) {
      return { error: 'Error minting NFT' }
    }

/*
    // Update Event to Prisma
    const data = {
      tokenId: tokenId,
      metadata: uriMeta
    }
    console.log('Event', data)
    const saved = await updateEvent(event.id, data)
    console.log('Saved', saved?.success)
    if (saved.success) {
      console.log('Event saved in DB!')
    } else {
      console.error('Error updating event in DB!')
    }
*/
    // Success
    const info = {
      success: true,
      image: event.image,
      metadata: uriMeta,
      tokenId: okMint.tokenId
    }
    console.log('RESULT', info)
    console.log('Minting completed')
    return info
  } catch (ex) {
    console.error(ex)
    return { error: ex.message }
  }
}
