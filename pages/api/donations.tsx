import { NextApiRequest, NextApiResponse } from 'next'
import { getNFTsByOrganization } from 'utils/registry'

export default async function donations(req: NextApiRequest, res: NextApiResponse) {
  console.log('Donations...')
  const orgid: string = req.query?.orgid?.toString() || ''
  console.log('ORGID', orgid)
  if(!orgid){
    return res.json({success:false, result:null, error:'Required parameters missing'})
  }
  const data = await getNFTsByOrganization(orgid)
  return res.json({success:true, result:data})
}
