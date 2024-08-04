import { NextApiRequest, NextApiResponse } from 'next'
import Xinfin from 'chains/xinfin'
import ipfsUpload from 'utils/upload-ipfs'
import { getStoryById, updateStory } from 'utils/registry'

export default async function Mint(req: NextApiRequest, res: NextApiResponse) {
  console.log('API MINTING NFT1155...')

  try {
    const {storyid} = req.query
    console.log('STORY', storyid)
    if(!storyid){
      console.log('Story id is required')
      return res.status(500).json({ error: 'Story id is required' })
    }

    // Form data
    const created = new Date().toJSON().replace('T', ' ').substring(0, 19)

    // Get story info
    let story = await getStoryById(storyid.toString())
    console.log('STORY', story)
    if(!story) {
      return res.status(500).json({ error: 'Story not found' })
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
      return res.status(500).json({ error: 'Error uploading metadata' })
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
      return res.status(500).json({ error: 'Error minting NFT' })
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
    console.log('Minting completed')
    console.log('RESULT', {
      success: true,
      image: story.image,
      metadata: uriMeta,
      tokenId: okMint.tokenId
    })
    return res.status(200).json({
      success: true,
      image: story.image,
      metadata: uriMeta,
      tokenId: okMint.tokenId
    })
  } catch (ex) {
    console.error(ex)
    return res.status(500).json({ success: false, error: ex.message })
  }
}
