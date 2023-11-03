import { NextApiRequest, NextApiResponse } from 'next'
import { getEventsByOrganization } from 'utils/registry'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req?.query?.id?.toString()
  const data = await getEventsByOrganization(id)
  return res.json(data)
}
