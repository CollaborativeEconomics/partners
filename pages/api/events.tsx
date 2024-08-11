import { NextApiRequest, NextApiResponse } from 'next'
import { getEvents, newEvent } from 'utils/registry'

type Dictionary = { [key:string]:any }

export default async function events(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req
  console.log('api/events', req.query)
  try {
    if (method == 'GET') {
      const args: Dictionary = req.query
      const params = new URLSearchParams(args)
      const search = params.toString()
      const data = await getEvents(search)
      return res.json({success:true, result:data})
    } else if (method == 'POST') {
      const result = await newEvent(body)
      console.log('NEWEVENT', result)
      return res.json(result)
    } else {
      res.status(405).send(JSON.stringify({error:'Method not allowed'}))
    }
  } catch(ex) {
    console.error(ex)
    res.status(500).send(JSON.stringify({error:ex.message}))
  }
}
