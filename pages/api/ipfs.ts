import { NextApiRequest, NextApiResponse } from 'next'
import * as fs from 'fs'
import * as formidable from 'formidable'
import fileUpload from 'utils/upload-aws'
import ipfsUpload from 'utils/upload-ipfs'
//import upload from 'utils/upload'

// To avoid bodyParser corrupting file data
export const config = {
  api: {
    bodyParser: false
  }
}

export default async function replicateHandler(req:NextApiRequest, res:NextApiResponse){
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, data, files) {
    if(err){
      console.log('FORM PARSE ERROR:', err)
      return res.status(500).json({success:false, error:'Error uploading file'})
    }
    console.log('data', data)
    console.log('file', files)
    try {
      const name = data.name[0]
      const file = files.file[0]
      const path = file.filepath
      //const orig = file.originalFilename
      const mime = file.mimetype
      //const size = file.size
      console.log('Uploading', name, path, mime)
      const bytes = await fs.readFileSync(path)
      await fs.unlinkSync(path)

      // awsUpload
      //const resp = await fileUpload(name, bytes, mime)
      //if(resp.error){
      //  return res.status(500).json({success:false, error:resp.error})
      //}
      
      // ipfsUpload
      const ipfs = await ipfsUpload(name, bytes, mime)
      if(ipfs.error){
        return res.status(500).json({success:false, error:ipfs.error})
      }
      //return res.status(200).json({success:true, image:resp.image, type:resp.type, url:resp.url, ipfs:'ipfs:'+ipfs.cid, uri:ipfs.url})
      return res.status(200).json({success:true, image:'?', type:'??', url:'???', ipfs:'ipfs:'+ipfs.cid, uri:ipfs.url})
    } catch(ex) {
      console.error(ex)
      return res.status(500).json({success:false, error:ex.message})
    }
  })
}