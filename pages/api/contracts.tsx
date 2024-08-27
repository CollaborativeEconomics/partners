import { NextApiRequest, NextApiResponse } from 'next'
import { getContract, newContract } from 'utils/registry'

type Dictionary = { [key:string]:any }

export default async function events(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req
  try {
    if (method == 'GET') {
      console.log('GET api/contracts', query)
      const entity_id = query?.entity_id.toString() || ''
      const chain = query?.chain.toString() || ''
      const network = query?.network.toString() || ''
      const contract_type = query?.contract_type.toString() || ''
      const data = await getContract(entity_id, chain, network, contract_type)
      return res.json({success:true, result:data})
    } else if (method == 'POST') {
      console.log('POST api/contracts', body)
      const result = await newContract(body)
      console.log('NEW CONTRACT', result)
      return res.json(result)
    } else {
      res.status(405).send(JSON.stringify({error:'Method not allowed'}))
    }
  } catch(ex) {
    console.error(ex)
    res.status(500).send(JSON.stringify({error:ex.message}))
  }
}
