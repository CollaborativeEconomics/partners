import { getOrganizationById } from 'utils/registry'
//import { getDonationsByOrganization } from 'utils/registry'
//import { getDonationsByOrganizationAndDate } from 'utils/registry'
//import { getDonationsByInitiative } from 'utils/registry'
//import { getDonationsByInitiativeAndDate } from 'utils/registry'
//import { getOrganizationByEmail } from 'utils/registry'
//import { getUserByEmail } from 'utils/registry'


// api/test
export default async function test(req: NextApiRequest, res: NextApiResponse) {
  console.log('> api/test')
  try {
    const orgid = '636283c22552948fa675473c'
    const initid = '6494f2513d6285419024c33a'
    const info = await getOrganizationById(orgid)
    //const info = await getDonationsByOrganization(orgid)
    //const info = await getDonationsByOrganizationAndDate(orgid, '2023-01-01', '2023-01-31')
    //const info = await getDonationsByOrganizationAndDate(orgid, '2023-02-01', '2023-02-28')
    //const info = await getDonationsByInitiative(initid)
    //const info = await getDonationsByInitiativeAndDate(initid, '2023-02-01', '2023-02-28')
    //const info = await getOrganizationByEmail('org1@example.com')
    //const info = await getUserByEmail('kuyawakata@gmail.com')
    res.status(200).setHeader("Content-Type", "text/plain").send(JSON.stringify(info||null,null,2))
  } catch(ex) {
    console.error(ex)
    res.status(200).setHeader("Content-Type", "text/plain").send(ex.message)
  }
}
