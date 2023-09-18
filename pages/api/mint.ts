import { NextApiRequest, NextApiResponse } from 'next'
import Xinfin from 'chains/xinfin'
import ipfsUpload from 'utils/upload-ipfs'
import { getEventById, updateEvent } from 'utils/registry'

export default async function Mint(req: NextApiRequest, res: NextApiResponse) {
  console.log('API MINTING NFT1155...')

  try {
    const {eventid} = req.query
    console.log('EVENT', eventid)
    if(!eventid){
      console.log('Event id is required')
      return res.status(500).json({ error: 'Event id is required' })
    }

    // Form data
    const created = new Date().toJSON().replace('T', ' ').substring(0, 19)

    // Get event info
    let event = await getEventById(eventid.toString())
    console.log('EVENT', event)
    if(!event) {
      return res.status(500).json({ error: 'Event not found' })
    }

    // Save metadata
    const metadata = {
      mintedBy: 'CFCE via Give',
      title: 'Impact NFT',
      created: created,
      organization: event.organization?.name,
      initiative: event.initiative?.title,
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
      return res.status(500).json({ error: 'Error uploading metadata' })
    }
    const cid = cidMeta?.cid
    const uriMeta = 'ipfs:' + cid
    //const uriMeta = cidMeta?.url
    console.log('URI', uriMeta)

    // Mint NFT
    const contract = process.env.XINFIN_NFT1155_CONTRACT
    const address = process.env.XINFIN_MINTER_WALLET // Minter gets all impact nfts
    const tokenId = '0x'+event.id
    const okMint = await Xinfin.mintNFT1155(contract, address, tokenId, uriMeta)
    console.log('Mint result', okMint)
    if (!okMint || okMint?.error) {
      return res.status(500).json({ error: 'Error minting NFT' })
    }

    // Save Event to Prisma
/*
    const data = {
      created: new Date(),
      name: 
      description:
      amount: 0
      image:
      organizationId:
      initiativeId:
      tokenId: 
      metadata:
    }
    console.log('NftData', data)
    const saved = await createNFT(data)
    console.log('Saved', saved?.success)
    if (saved.success) {
      console.log('NFT saved in DB!')
    } else {
      console.error('Error saving NFT in DB!')
    }
*/

/*
    // Update Event to Prisma
    const data = {
      created: new Date(),
      name: 
      description:
      amount: 0
      image:
      organizationId:
      initiativeId:
      tokenId: 
      metadata:
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
    console.log('Minting completed')
    console.log('RESULT', {
      success: true,
      image: event.image,
      metadata: uriMeta,
      tokenId: okMint.tokenId
    })
    return res.status(200).json({
      success: true,
      image: event.image,
      metadata: uriMeta,
      tokenId: okMint.tokenId
    })
  } catch (ex) {
    console.error(ex)
    return res.status(500).json({ success: false, error: ex.message })
  }
}
