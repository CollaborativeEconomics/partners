import { NextApiRequest, NextApiResponse } from 'next'
import { getOrganizationById } from 'utils/registry'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req?.query?.id?.toString()
  const data = await getOrganizationById(id)
  return res.json({...data})
}
